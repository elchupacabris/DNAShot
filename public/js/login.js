// ------------------------------
// Initialize Firebase
// ------------------------------
const firebaseConfig = {
  // ATENCIÓN: Debes reemplazar estos valores con los de TU PROYECTO DNAShot-b2fa0
  // Puedes encontrarlos en la Consola de Firebase > Configuración del proyecto > Tus aplicaciones
  // Debajo de "Tu app", selecciona la configuración para Web, y copia el objeto `firebaseConfig`
  apiKey: "AIzaSyDT8uclSbsMCGDjxohUe7x1jwnq4zInr6w",
  authDomain: "dnashot-b2fa0.firebaseapp.com",
  projectId: "dnashot-b2fa0",
  storageBucket: "dnashot-b2fa0.firebasestorage.app",
  messagingSenderId: "1054670174023",
  appId: "1:1054670174023:web:74cf1fdfb7a3518638fe62",
  measurementId: "G-JMHVGW13LF"
  // Si tienes más propiedades como storageBucket, messagingSenderId, etc., cópialas también
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ------------------------------
// Toggle Logic (Login <--> Signup)
// ------------------------------
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
document.getElementById('show-signup').addEventListener('click', () => {
  loginSection.style.display = 'none';
  signupSection.style.display = 'block';
  document.getElementById('login-msg').textContent = '';
});
document.getElementById('show-login').addEventListener('click', () => {
  signupSection.style.display = 'none';
  loginSection.style.display = 'block';
  document.getElementById('signup-msg').textContent = '';
});

// ------------------------------
// LOGIN
// ------------------------------
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const msg = document.getElementById('login-msg');
  msg.textContent = '';

  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    const uid = cred.user.uid;

    // Verifica si existe el perfil en Firestore dentro de "users/{uid}"
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (userDoc.exists && userDoc.data().nombre) {
      // Perfil ya creado: redirige a HOME.html
      window.location.href = 'HOME.html';
    } else {
      // No existe 'nombre' en perfil: va a player-details.html
      window.location.href = 'player-details.html';
    }
  } catch (err) {
    msg.textContent = 'Email o contraseña incorrectos.';
  }
});

// ------------------------------
// SIGNUP
// ------------------------------
document.getElementById('signup-btn').addEventListener('click', async () => {
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const msg = document.getElementById('signup-msg');
  msg.textContent = '';

  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCred.user.uid;

    // Crea perfil mínimo en Firestore (sin 'nombre' aún)
    await db.collection('users').doc(uid).set({
      email,
      createdAt: new Date().toISOString()
    });

    msg.style.color = '#225a2b';
    msg.textContent = 'Cuenta creada. Ahora inicia sesión.';
  } catch (err) {
    msg.textContent = err.message;
  }
});
