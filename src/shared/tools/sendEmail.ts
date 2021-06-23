import SibApiV3Sdk from 'sib-api-v3-sdk'

export const sendEmailToNewCustomer = (userData: any) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance
  const apiKey = defaultClient.authentications['api-key']
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY
  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  
  sendSmtpEmail = {
    to: [
      {
        email: 'daddy.studies@gmail.com',
        name: userData.firstname + userData.lastname,
      },
    ],
    templateId: 3,
    params: {
      firstname: userData.firstname,
      password: userData.password,
      email: userData.email,
    },
  }

  apiInstance
    .sendTransacEmail(sendSmtpEmail)
    .then(function (data: any) {
      console.log('API called successfully')
    })
    .catch((err: any) => console.log(err))
}
