import jwt from 'jsonwebtoken';

const RefreshTokenGenerator = (data)=>{
    const userData = {
        id: data,
    }
    try{
        const token = jwt.sign(userData, process.env.REFRESH_SECRET_KEY, {expiresIn: '10min'})
        return token;
    }catch(e){
        console.log(e);
    }
}

export default RefreshTokenGenerator;