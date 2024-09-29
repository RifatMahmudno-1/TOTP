function stringToBase32(text: string) {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
	let bits = ''
	let output = ''

	/** Convert each character to byte */
	const byteArray = new TextEncoder().encode(text)

	/** convert each character to bits */
	for (let i = 0; i < byteArray.length; i++) {
		bits += byteArray[i].toString(2).padStart(8, '0')
	}

	/**
	 *  Group by 5 charactes
	 * to convert to base 32
	 */
	for (let i = 0; i < bits.length; i += 5) {
		output += alphabet[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)]
	}

	/** Add padding '=' if necessary to make output length a multiple of 8 */
	while (output.length % 8 !== 0) {
		output += '='
	}

	return output
}

function base32Decode(base32: string) {
	const base32Lookup = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25, '2': 26, '3': 27, '4': 28, '5': 29, '6': 30, '7': 31 }
	let bits = ''
	const output: number[] = []

	/** remove trailing equals */
	base32 = base32.replace(/=+$/, '')

	for (let i = 0; i < base32.length; i++) {
		/** get decimal value for each base32 number */
		const val = base32Lookup[base32[i].toUpperCase()]
		if (!val) throw new Error('Invalid base32 string provided')

		/**
		 * each base32 number is a 5 bit number
		 * convert that dacimal to binary
		 */
		bits += val.toString(2).padStart(5, '0')
	}

	/**
	 * group by 8 numbers
	 * cause we will be using Uint8Array
	 */
	for (let i = 0; i < bits.length; i += 8) {
		output.push(parseInt(bits.slice(i, i + 8), 2))
	}

	return new Uint8Array(output)
}

async function generateHMAC(key: Uint8Array, counter: number) {
	const counterArray = new Uint8Array(8)

	for (let i = 7; i >= 0; i--) {
		/** get least significant byte (8 bits) from counter */
		counterArray[i] = counter % 256

		/** this part contains rest of the bytes */
		counter = Math.floor(counter / 256)
	}

	const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: { name: 'SHA-1' } }, false, ['sign'])
	const hmac = await crypto.subtle.sign('HMAC', cryptoKey, counterArray)

	return new Uint8Array(hmac)
}

async function generateTOTP(secret: string, timestamp = Date.now()) {
	const TIME_STEP = 30 // token will stay valid for 30 seconds
	const counter = Math.floor(timestamp / (1000 * TIME_STEP))

	const key = base32Decode(secret)
	const hmac = await generateHMAC(key, counter)

	/**
	 * hmac has 20 bytes (SHA-1)
	 * last byte determines which 4 bytes to use for OTP
	 *
	 * offset value must be less than 16 (0-15)
	 * Because we have already used the last byte and
	 * if the value is more than 15, we can't get 4 bytes.
	 */
	const offset = hmac[hmac.length - 1] % 16

	/**
	 * hmac[offset + 1] is the value
	 * hmac[offset + 1] % 256 ensures that the value stays between 0-256
	 * 256**2 moves the byte 2 positions left.
	 *
	 * Compare between
	 * hmac[offset + 1].toString(2) and (hmac[offset + 1] * 256 ** 2).toString(2)
	 * to see for yourself
	 *
	 * in 1st value %128 is used instead of %256
	 * to remove the sign bit and to keep the number positive.
	 */
	const binary =
		(hmac[offset + 0] % 128) * 256 ** 3 + // 1st value, moved 3 positions
		(hmac[offset + 1] % 256) * 256 ** 2 + // 2nd value, moved 2 positions
		(hmac[offset + 2] % 256) * 256 ** 1 + // 3rd value, moved 1 position
		(hmac[offset + 3] % 256) * 256 ** 0 // last value, moved 0 position

	/** get 6 digit number and return */
	const otp = binary % 1_00_00_00
	return otp.toString().padStart(6, '0')
}

async function verifyTOTP(secret: string, userToken: string, timestamp = Date.now()) {
	const generatedToken = await generateTOTP(secret, timestamp)
	return generatedToken === userToken
}

export default { generateTOTP, verifyTOTP, stringToBase32 }
export { generateTOTP }
export { verifyTOTP }
export { stringToBase32 }
