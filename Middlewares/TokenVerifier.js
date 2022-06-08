import jwt from 'jsonwebtoken';

const TokenVerifier = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        try{
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            jwt.verify(bearerToken,process.env.ACCESS_SECRET_KEY ,(err, authData)=>{
                if(err){
                    res.status(401).json({
                        message : "invalid token"
                    });
                }
                else{
                    console.log(authData);
                    req.body.user_id = authData;
                    next();
                }
            })
        }
        catch(e){
            console.log("error");
        }
    }
    else{
        res.sendStatus(403);
    }
}

export default TokenVerifier;