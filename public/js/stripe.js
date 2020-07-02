import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe("pk_test_51GzZkYCgIiW5wWot7iYDXtRydPP10iaRsAkY9mnrX7wrgd9d01cAeovG1Kj6TbfgXT67o5zoq2NMl8nCOKzo5DRD00r4tRaSku");

export const bookTour = async (tourId) =>
{
    try {
        // Get checkout session from api
        const session = await axios(`http://127.0.0.1:3000/api/bookings/checkout-session/${tourId}`);
        // console.log(session);

        // Create checkout form + charge amount
        await stripe.redirectToCheckout({ sessionId: session.data.session.id });


    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }

}