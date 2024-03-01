import * as jwt from 'jsonwebtoken'
import {Jwt, JwtPayload} from 'jsonwebtoken'


export const signJWT = (payload: string | Buffer | object) => {
    return jwt.sign(payload, process.env.JWT_TOKEN!, {
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
        expiresIn: '1h'
    })
}

export const decodePayloadFromJWT = (token: string): JwtPayload | null => {
    let verify;
    try {
        verify = jwt.verify(token, process.env.JWT_TOKEN!, {
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER
        })
    } catch (err) {
        return null;
    }
    let decoded = verify as Jwt
    return decoded as JwtPayload;
}