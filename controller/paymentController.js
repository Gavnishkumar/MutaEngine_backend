
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentIntent = async (req, res) => {
  const { amount, currency,email,remarks,CaptchaToken } = req.body;
  const secretKey = process.env.CAPTCHA_SECRET_KEY 
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${CaptchaToken}`;
  const verificationResponse= await axios.post(verificationUrl);
  const captchaData = await verificationResponse.json();
  if (!captchaData.success) {
    return res.json({ success: false, message: "Captcha verification failed" });
  }
  try {
    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe accepts amounts in cents
      currency: currency || 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send clientSecret back to the frontend
    // sucess is true for captch verification not for payment success
    res.send({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({success: true, error: 'Payment failed!' });
  }
};

module.exports = {
  paymentIntent,
}