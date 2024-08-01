const express=require("express");
const myrouter=express.Router()
const connection=require("../db/dbconnect")

myrouter.get("/login",function(req,resp){
    resp.render("login")
   // resp.sendFile("login.html",{root:__dirname})
})

myrouter.post("/validateuser",function(req,resp){
    //retrieve username and password from the request
    var email=req.body.email;
    var password=req.body.password;
    console.log(req.body)
    //validate user from mysql table
    //retrieve the data from user table
    connection.query("select email,password from user where email=? and password=?",[email,password],function(err,data,fields){
        
        if(data.length>0){ //check whether the row is found or not
            console.log(data[0]);  
            if((data[0].email===email)&&(data[0].password===password)){

                // resp.send("valid user"+data[0].role)
                resp.status(200).redirect("/courses")
            }else{
                resp.send("Invalid user")
            }
        }else{
            resp.send("Invalid user")
        }

    })//end of query
})

myrouter.get("/logout",function(req,resp){
    resp.render("login")
})

//retrieve all courses
myrouter.get("/courses",function(req,resp){
     connection.query("select * from course",function(err,data,fields){
        if(err){
            resp.status(500).send("no data found")
        }else{
            //display course data in table format with the help of displaycourse.ejs
            resp.status(200).render("displaycourse",{proddata:data})
        }

     })
})

//display empty form to add course from add_course.ejs
myrouter.get("/addcourseform",function(req,resp){
     resp.render("addcourse")
})

//get data from form and add it in the databse
myrouter.post("/insertcourse",function(req,resp){
    connection.query("insert into course values(?,?,?,?)",[req.body.cid,req.body.cname,req.body.fees,req.body.duration],function(err,result){
        if(err){
            resp.status(500).send("error occured")
        }else{
            //request will be redirected to courses url, to show the table
            if(result.affectedRows>0){
                resp.redirect("/courses")
            }
        }

    })
})

//data will be deleted from the database
myrouter.get("/deletecourse/:id",function(req,resp){
    console.log("cid: ",req.params.id);
    connection.query("delete from course where cid=?",[req.params.id],function(err,result){
        if(err){
            console.log(err)
            resp.status(500).send("no data deleted")
        }
        else{
             //request will be redirected to courses url, to show the table
            if(result.affectedRows>0){
                resp.redirect("/courses")  
            }
        }

    })

})

//data will be displayed in the form for editing
//by using file update_prod.ejs
myrouter.get("/editcourse/:id",function(req,resp){
     connection.query("select * from course where cid=?",[req.params.id],function(err,data){
        if(err){
            resp.status(500).send("data not found")
        }else{
            if(data.length>0){
                resp.render("update_prod",{prod:data[0]})
            }
        }
     })
})

//data will get updated in the database
myrouter.post("/updatecourse",function(req,resp){
    connection.query("update course set cname=?,fees=?,duration=?  where cid=?",[req.body.cname,req.body.fees,req.body.duration,req.body.cid],function(err,result){
        if(err){
            console.log(err);
            resp.status(500).send("no data updated")
        }else{
             //request will be redirected to courses url, to show the table
            resp.redirect("/courses");
        }

    })

})

module.exports=myrouter;