import * as auth from "@clinic/crypto"

import { expect, test } from 'vitest'

// Both tests below should have deterministic outputs

// Tests the hashing done in the client side
test('Sha256', async() => {
    const inputs = {
        username: 'chani',
        password: await auth.sha256Hex('sihaya'),
    }   
    expect(inputs.password).toBe('fb2348f7ded6cdb03c6f7ee7ebb3dc51e06aadc5da567c892e8e9497e8f23611')
});

// Tests the hashing done in the server side
test('Argon2id', async() => {
    const inputs = {
        username: 'chani',
        password: 'sihaya',
        salt: 'my melange',
    }
    const derivedPassword = await auth.derivePassword(inputs.password, inputs.salt)
    expect(derivedPassword).toBe('f9f1a4de8c35891f107f9780a081c3e4fcd33f749c413015981e1606dae3178950b020012713cf4e5f7f672307c443a7a29184494a442c372c1e74fa36ea027d58e4e73b99dc772bc10a2918f7351389bd432c098e6756ed9a9ae1a2cb5ecf12baf3cd25eada099260f03b2d10c8453844cbb082323d79ac1a62efe1e5c9af16')
})
