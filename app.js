let bodyparser,app,express,request;

express = require('express');
bodyparser = require('body-parser');
request = require('request');
app = express();

app.use(express.static('Public')); //this allows us to css and other data from a static
// location In form of a folder or file :Here in our css and pics exist inside it.
app.use(bodyparser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function(req,res) //this allows heroku to host on 
   {//port and also us to locally host on 3000.
      console.log('Your server is started at port 3000.')
   });
app.get('/', function(req,res)
   {
      res.sendFile(__dirname+'/Signup.html')
   });


app.post('/', function(req,res)
{  let fname,lname,email,options;
   fname = req.body.fname;
   lname = req.body.lname;
   email = req.body.email;
   
   data = 
   {
     members: 
     [//for more https://mailchimp.com/developer/reference/lists/#post_/lists/-list_id-
      {
      	email_address: email,
      	status: 'subscribed',
      	merge_fields: 
      	  {
            FNAME: fname,
            LNAME: lname
      	  }
      }
     ]
   }// we can add multiple users data in array by just adding more objects {} Upto 5oo 
   Jsondata = JSON.stringify(data)
   options = 
   {
   	url: 'https://us18.api.mailchimp.com/3.0/lists/3f39d13fb6',
   	methord: 'POST',
   	headers: { "Authorization": "sujiiit 9767014ef1d8e8231e6d59e2c9df576f-us18"	},
   	body: Jsondata
   }

   request(options, function(error,response,body)
   {
   	 if(error)
   	 {
   	 	res.sendFile(__dirname+'/Failed.html');
   	 }
     else if(response.statusCode==200)
      	{
    	  // console.log('succed');
    	  res.sendFile(__dirname+"/Success.html");
      	 }
      	else
         {
      	  // console.log(response.statusCode);
      	  res.sendFile(__dirname+'/Failed.html');
         }
   });
});



app.post('/Failed' , function(req,res)//when the failure page button got clicked then	
{// this post request comes in action and redirect the user to the home page.
//res.redirect('/');  //we can also use sendfile but redirecting is better than resending.
 res.sendFile(__dirname+'/Failed.html');
});
// audiance or List id: 3f39d13fb6
// API key: 9767014ef1d8e8231e6d59e2c9df576f-us18
// ex: 
// curl --request POST \
// --url 'https://usX.api.mailchimp.com/3.0/lists' \
// --user 'anystring:apikey' \
// --header 'content-type: application/json' \
// --data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \
// --include