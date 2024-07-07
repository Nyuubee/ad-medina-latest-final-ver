import { sha256Hex } from "@clinic/crypto"

export async function login(username: string, password: string) {
    const { signIn } = useAuth()
    const result = await signIn('credentials', {
        username,
        password: await sha256Hex(password),
        redirect: false,
    })
    console.log(result)
    if (result.error == null) {
        const router = useRouter()
        router.push('/')
    }

    return result
}

