const { GMAIL_EMAIL } = require("../../config");
const mailSender = require("../../config/email.config");
const { allNonGroupExpenses } = require("../../services/expense.service");
const { getSettlementsInUsers } = require("../../services/settlement.service");

const getFinalLedgerOfUsers = async ()=>{
      const ledger ={};

        // --start building ledger-- with expenses-we have 
           const allExpenses = await allNonGroupExpenses();
        if(!allExpenses.length)
            return;

        allExpenses.map( expense =>{
            const{_id,name,email} = expense.paidByUserId;
            const PayerDetails = {
                _id,name,email
            }
            let otherPartner ={};
            let owedAmount = 0;
            expense.splits.map( envUser =>{
                if(envUser.userId._id.toString() !== PayerDetails._id.toString()){
                    const {_id,name,email}= envUser.userId;
                    otherPartner = {_id,name,email};
                      owedAmount = Number(envUser.amount);
                }
            })
            otherPartner["_id"] = otherPartner._id.toString()
            PayerDetails["_id"] = PayerDetails._id.toString()
           // console.log("payer :",PayerDetails ,"otherPartner",otherPartner)
            const refId = otherPartner._id.toString();
            if(!ledger[refId]){
                ledger[refId] = {
                    ...otherPartner,
                    debts : []
                }
               
            }
            const atIndex = ledger[refId].debts.findIndex( owesTo => (owesTo._id.toString() === PayerDetails._id.toString()))
            if(atIndex === -1){
                ledger[refId].debts.push({name:PayerDetails.name,_id:PayerDetails._id,email:PayerDetails.email,amount:owedAmount})
            }
            else{
                const newAmount = owedAmount;
                const oldAmountPresent = ledger[refId].debts[atIndex].amount;
                ledger[refId].debts[atIndex] = {...ledger[refId].debts[atIndex],amount:oldAmountPresent+newAmount} 
            }
           // console.log("okk ",PayerDetails,otherPartner.amount,otherPartner.email,atIndex)
        })  

        //  console.log("ledger before settlments:",JSON.stringify(ledger,null,2))

            const allSettlements = await getSettlementsInUsers({});
            

            // console.log(" all settlement :",allSettlements)

            // settling ledger with settlement-- 


            allSettlements.map( settlement =>{
                const payerDetails = {
                    ...settlement.paidByUser.toObject()
                }
                const receiverDetails = {
                    ...settlement.paidToUser.toObject()
                }
                // console.log("payer is:",payerDetails)
                // console.log("receiver is:",receiverDetails)
                // console.log("amount is:",settlement.amount)
                // console.log("legder before updation of ",payerDetails._id," : ",ledger[payerDetails._id])
                const payerId = payerDetails._id.toString();
                const receiverId = receiverDetails._id.toString();
                if(!ledger[payerId]){
                    if(!ledger[receiverId]){
                        ledger[receiverId] = {
                            name:receiverDetails.name,
                            email:receiverDetails.email,
                            debts:[{name:payerDetails.name,email:payerDetails.email,amount:Number(settlement.amount)}]
                        }
                    }
                    else{
                        const atIndex = ledger[receiverId].debts.findIndex(owesTo => (owesTo._id.toString() === payerId))
                         if(atIndex === -1){
                            ledger[receiverId].debts.push({name:payerDetails.name,_id:payerId,email:payerDetails.email,amount:Number(settlement.amount)})
                        }
                        else{
                            const newAmount = Number(settlement.amount);
                            const oldAmountPresent = ledger[receiverId].debts[atIndex].amount;
                            ledger[receiverId].debts[atIndex] = {...ledger[receiverId].debts[atIndex],amount:oldAmountPresent+newAmount} 
                        }
                    }
                }

                else{
                     const atIndex = ledger[payerId].debts.findIndex(owesTo => (owesTo._id.toString() === receiverId.toString()))
                    //  console.log("atIndex :",atIndex)   
                     if(atIndex === -1){
                            ledger[payerId].debts.push({name:receiverDetails.name,_id:receiverId,email:receiverDetails.email,amount:-1*Number(settlement.amount)})
                        }
                        else{
                            const newAmount = Number(settlement.amount);
                            const oldAmountPresent = ledger[payerId].debts[atIndex].amount || 0;
                            ledger[payerId].debts[atIndex] = {...ledger[payerId].debts[atIndex],amount:oldAmountPresent-newAmount} 
                        }
                }
                // console.log("legder updated of ",payerDetails._id," : ",ledger[payerDetails._id])

            })

            const activeUsers =  Object.keys(ledger);
            //  console.log("ledger after:",JSON.stringify(ledger,null,2))
            const updatedledger =  activeUsers.map( payeeKey =>{
                const payee = ledger[payeeKey]
                const updatedPayee = {...payee};
                 //console.log("payee :",payee)
                const updatedDebts = payee.debts.map( toPay =>{
                    let updatedDebt = {...toPay};
                    if(toPay.isSettled){
                        delete updatedDebt.isSettled
                      //  console.log("byr updated :",updatedDebt)
                        return updatedDebt;
                    }
                    let isPayeeTheFinalPayer = true;
                    const toPayAmount = toPay.amount;
                    let netAmount = 0;
                    let otherNeedsToPayThisPayee = 0;
                    const id = toPay._id
                    //  console.log(payeeKey,id)
                    let counterLedgerToPayee = ledger[id];
                    // let counterLedgerToPayee = {};
                    // if()
                     //console.log("counterLedger :",counterLedgerToPayee)
                    if(!counterLedgerToPayee){
                        if(toPayAmount<0){
                            ledger[id] = {
                                _id:id,
                                name:toPay.name,
                                email:toPay.email,
                                debts:[{name:payee.name,_id:payee._id,email:payee.email,amount:Math.abs(toPayAmount)}]
                            }
                            updatedDebt["amount"] = 0;
                        }
                        return updatedDebt
                    }
                    const indexAt = counterLedgerToPayee.debts.findIndex( user => user._id.toString() === payeeKey);
                //  console.log("atindex :",indexAt)
                    if(indexAt === -1){
                        if(toPayAmount>0)
                            return updatedDebt;

                    }
                    if(indexAt !== -1){
                        otherNeedsToPayThisPayee = counterLedgerToPayee.debts[indexAt].amount || 0;
                    }
                    if(otherNeedsToPayThisPayee > toPayAmount)
                        isPayeeTheFinalPayer = false;
                  // console.log("other pahy :",otherNeedsToPayThisPayee,toPayAmount)
                    if(isPayeeTheFinalPayer){
                        //   console.log("1>2")
                        netAmount = toPayAmount - otherNeedsToPayThisPayee;
                        updatedDebt["amount"] = netAmount;
                       if(indexAt)
                        counterLedgerToPayee.debts[indexAt].amount = 0;
                        //counterLedgerToPayee.debts[indexAt]["isSettled"] = true;

                    }
                    else{
                        // console.log("2>1")
                        netAmount = otherNeedsToPayThisPayee - toPayAmount;
                        updatedDebt["amount"] = 0;
                        counterLedgerToPayee.debts[indexAt].amount = netAmount;
                        counterLedgerToPayee.debts[indexAt]["isSettled"] = true;
                    }
                    //console.log("currPayee :",payee,"newDebt",updatedDebt,"updated :",counterLedgerToPayee)
                    return updatedDebt;
                } )
              //  console.log( "new updated debt :",updatedDebts)
                updatedPayee.debts = updatedDebts;
                return updatedPayee;
            } )
        //   console.log("new updatedLadger",JSON.stringify(updatedledger,null,2));
            // net legder ---
            
            const netLedger = [];
            if(!updatedledger.length)
                return netLedger;

            updatedledger.forEach( ledger =>{
                let activeDebts = [];
                ledger.debts.forEach( toPay =>{
                    if(toPay.amount === 0 )
                        return ;
                    activeDebts.push(toPay);
                })

                if(activeDebts.length){
                    netLedger.push({...ledger,debts:activeDebts});
                }
            })
    console.log("net Ledger :",JSON.stringify(netLedger,null,2))
   return netLedger;
}

const prepareMails = async (ledger) => {
  if (!ledger.length) return [];

  const results = [];

  for (const u of ledger) {
    if (!u.email) {
      results.push({ userId: u._id, skipped: true, reason: "No email" });
      continue;
    }

    const rows = u.debts.map(d => `
      <tr>
        <td style="padding:4px 8px;">${d.name}</td>
        <td style="padding:4px 8px;">₹${d.amount.toFixed(2)}</td>
      </tr>
    `).join("");

    if (!rows) {
      results.push({ userId: u._id, skipped: true });
      continue;
    }

    const html = `
      <h2>Splitr – Payment Reminder</h2>
      <p>Hi ${u.name}, you have the following outstanding balances:</p>
      <table cellspacing="0" cellpadding="0" border="1" style="border-collapse:collapse;">
        <thead>
          <tr><th>To</th><th>Amount</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p>Please settle up soon. Thanks!</p>
    `;


console.log("reached")
    try {
      await sendEmail({
        mailFrom: GMAIL_EMAIL,
        mailTo: u.email,
        subject: "You have pending payments on Splitr",
        html,
      });
      results.push({ userId: u._id, success: true });
    } catch (err) {
        console.log(err)
      results.push({ userId: u._id, success: false, error: err.message });
    }
  }

  return results;
};

const sendEmail = async ({ mailFrom, mailTo, subject, html }) => {
  const response = await mailSender.sendMail({
    from: mailFrom,
    to: mailTo,
    subject,
    html,
  });
  return response;
};


module.exports = {
    getFinalLedgerOfUsers,
    prepareMails,
}