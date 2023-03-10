import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendRegistrationEmail = async (email) => {
  console.log("trying")
  const msg = {
    to: email.recipient,
    from: process.env.SENDER_EMAIL_ADDRESS,
    subject: email.subject,
    text: email.text,
    html: email.html,
  }
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}
