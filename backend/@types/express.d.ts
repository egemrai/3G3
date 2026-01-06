import "express"

declare global {
  namespace Express {
    interface Request {
      requestId: string
    }
  }
}
//bu req.requestId diye yazılıyor arada session yok

// Express’in Request objesini
// doğrudan genişletir

// 3️⃣ En kritik fark (runtime farkı)
// req.session

// middleware ile eklenir (express-session)

// cookie + store + persistence

// kullanıcıya bağlı

// request’ler arası yaşar

// req.requestId

// her request için yeni

// RAM’de yaşar

// request bitince ölür

// debug amaçlı

// 4️⃣ NEDEN req.session.requestId DEĞİL?

// Çünkü session = kullanıcı kimliği
// requestId = işlem kimliği