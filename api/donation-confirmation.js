// Vercel Node.js function. Secrets belong in Vercel environment variables.
module.exports = async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
 if(!String(req.headers['content-type']||'').includes('application/json'))return res.status(415).json({error:'Please submit the website form.'});
 let body=req.body;
 try{if(typeof body==='string')body=JSON.parse(body);}catch{return res.status(400).json({error:'Invalid submission.'});}
 if(!body||typeof body!=='object'||Array.isArray(body))return res.status(400).json({error:'Invalid submission.'});
 if(JSON.stringify(body).length>12000)return res.status(413).json({error:'Your submission is too long.'});
 if(body.website)return res.status(400).json({error:'Unable to submit this form.'});
 const text=(key,max=200)=>typeof body[key]==='string'?body[key].trim().slice(0,max):'';
 const name=text('name',100),email=text('email',254),phone=text('phone',40),amount=text('amount',20),currency=text('currency',3),method=text('method',30),kind=text('kind',30),reference=text('reference',150),message=text('message',2000);
 if(!name||/[\r\n]/.test(name)||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||/[\r\n]/.test(email)||phone.length<5||!/^\+?[\d\s().-]{5,40}$/.test(phone))return res.status(400).json({error:'Please enter a valid name, email address and phone number.'});
 if(!/^\d{1,12}(\.\d{1,2})?$/.test(amount)||Number(amount)<=0)return res.status(400).json({error:'Please enter a valid donation amount.'});
 if(!['PKR','USD','GBP','EUR','AED','SAR','CAD','AUD'].includes(currency)||!['Bank Transfer','Bank Deposit','EasyPaisa/JazzCash','Other'].includes(method)||!['General Donation','Zakat','Sadaqat','Sponsorship'].includes(kind))return res.status(400).json({error:'Please select valid donation details.'});
 if(body.consent!==true)return res.status(400).json({error:'Please confirm permission to contact you about this donation.'});
 const apiKey=process.env.RESEND_API_KEY,from=process.env.DONATION_FROM_EMAIL;
 if(!apiKey||!from)return res.status(503).json({error:'The online form is temporarily unavailable. Please email chambeli.org@gmail.com or call the institute.'});
 const plain=['Donation confirmation submitted on the Chambeli website','This is a donor report, not verification that funds were received.','',`Name: ${name}`,`Email: ${email}`,`Phone: ${phone}`,`Amount: ${currency} ${amount}`,`Donation type: ${kind}`,`Method: ${method}`,`Transaction reference: ${reference||'Not provided'}`,`Message: ${message||'Not provided'}`].join('\n');
 try{
  const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:['chambeli.org@gmail.com'],reply_to:email,subject:`Donation confirmation — ${currency} ${amount}`,text:plain}),signal:AbortSignal.timeout(12000)});
  const response=await result.json().catch(()=>({}));
  if(!result.ok||!response.id)return res.status(502).json({error:'Your confirmation could not be sent. Please email chambeli.org@gmail.com with your donation details.'});
  return res.status(200).json({ok:true,message:'Thank you. Your donation details have been sent to the institute for review.'});
 }catch{return res.status(502).json({error:'Your confirmation could not be sent. Please email chambeli.org@gmail.com with your donation details.'});}
};
