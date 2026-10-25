// Vercel server function. Uses the same email settings as donation notifications.
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
 if(!String(req.headers['content-type']||'').includes('application/json'))return res.status(415).json({error:'Please use the contact form.'});
 let body=req.body;try{if(typeof body==='string')body=JSON.parse(body);}catch{return res.status(400).json({error:'Invalid submission.'});}
 if(!body||typeof body!=='object'||Array.isArray(body))return res.status(400).json({error:'Invalid submission.'});
 if(JSON.stringify(body).length>14000)return res.status(413).json({error:'Your message is too long.'});
 if(body.website)return res.status(400).json({error:'Unable to submit this message.'});
 const text=(key,max)=>typeof body[key]==='string'?body[key].trim().slice(0,max):'';
 const name=text('name',100),email=text('email',254),phone=text('phone',40),subject=text('subject',150),topic=text('topic',60),message=text('message',4000);
 if(!name||/[\r\n]/.test(name)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||/[\r\n]/.test(email))return res.status(400).json({error:'Please enter your name and a valid email address.'});
 if(phone&&!/^\+?[\d\s().-]{5,40}$/.test(phone))return res.status(400).json({error:'Please enter a valid phone number or leave it blank.'});
 if(!subject||/[\r\n]/.test(subject)||message.length<10)return res.status(400).json({error:'Please add a subject and a message of at least 10 characters.'});
 if(!['General Enquiry','School / Admissions','Rehabilitation / Fitness','Vocational Training','Sponsorship','Donation','Arrange a Visit'].includes(topic))return res.status(400).json({error:'Please select an enquiry topic.'});
 if(body.consent!==true)return res.status(400).json({error:'Please agree that the institute may use these details to respond.'});
 const key=process.env.RESEND_API_KEY,from=process.env.DONATION_FROM_EMAIL;
 if(!key||!from)return res.status(503).json({error:'The online form is temporarily unavailable. Please email chambeli.org@gmail.com or call +92 51 484 2757.'});
 const plain=['New contact enquiry from the Chambeli website','',`Name: ${name}`,`Email: ${email}`,`Phone: ${phone||'Not provided'}`,`Topic: ${topic}`,`Subject: ${subject}`,'','Message:',message].join('\n');
 try{
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:['chambeli.org@gmail.com'],reply_to:email,subject:`Website enquiry — ${subject}`,text:plain}),signal:AbortSignal.timeout(12000)});
  const result=await response.json().catch(()=>({}));
  if(!response.ok||!result.id)return res.status(502).json({error:'Your message could not be sent. Please email chambeli.org@gmail.com or call the institute.'});
  return res.status(200).json({ok:true,message:'Thank you. Your message has been sent to Chambeli Institute.'});
 }catch{return res.status(502).json({error:'Your message could not be sent. Please email chambeli.org@gmail.com or call the institute.'});}
};
