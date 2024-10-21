import { Booked } from "../Booked/book.model";
import { varifyPayment } from "./payment.utils";


const paymentUpdate = async (transactionId: string, status: string) => {
  
  const verifyResponse = await varifyPayment(transactionId);


  if (verifyResponse && verifyResponse?.status === 200 ) {
 
   const result = await Booked.findOneAndUpdate(
      {transactionId},
      { paymentStatus: 'Paid' }
    );

  }
  
  return `
    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
      <h1 style="color: ${status === 'success' ? 'green' : 'red'};">
        Payment ${status === 'success' ? 'Successful' : 'Failed'}
      </h1>
      <p style="font-size: 18px; color: #333;">
        ${status === 'success' 
          ? 'Thank you for your purchase! You will be redirected to the homepage shortly.' 
          : 'Unfortunately, your payment was not successful. Please try again or contact support.'}
      </p>
      <button style="padding: 10px 20px; background-color: ${status === 'success' ? '#4CAF50' : '#F44336'}; border: none; color: white; cursor: pointer; border-radius: 5px;">
        <a href="https://empty-oven.surge.sh/" style="color: white; text-decoration: none; font-size: 16px;">
          Return to Home
        </a>
      </button>
    </div>
  `;
};


export const paymentService = {
    paymentUpdate,
}