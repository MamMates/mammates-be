import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: 'mammates-ba474.firebaseapp.com',
  projectId: 'mammates-ba474',
  storageBucket: 'mammates-ba474.appspot.com',
  messagingSenderId: '1000221345484',
  appId: '1:1000221345484:web:2d7b9667d2f21d0902a469',
  measurementId: 'G-LT92SJ5HPS',
};

const app = initializeApp(firebaseConfig);

const registerAccount = async (email, password) => {
  const auth = getAuth(app);
  const registerStatus = {
    uid: '',
    created_at: 0,
    error: null,
  };

  const register = await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { user } = userCredential;
      registerStatus.uid = user.reloadUserInfo.localId;
      registerStatus.created_at = user.reloadUserInfo.createdAt;
      return user;
    })
    .catch((error) => {
      registerStatus.error = error.code;
      return false;
    });

  if (!register) {
    return registerStatus;
  }

  await sendEmailVerification(register);
  return registerStatus;
};

const loginAccount = async (email, passowrd) => {
  const auth = getAuth();
  const loginStatus = {
    uid: '',
    verified: false,
    error: null,
  };

  await signInWithEmailAndPassword(auth, email, passowrd)
    .then((userCredential) => {
      const { user } = userCredential;
      loginStatus.uid = user.reloadUserInfo.localId;
      loginStatus.verified = user.reloadUserInfo.emailVerified;
    })
    .catch((error) => {
      loginStatus.error = error.code;
    });

  if (!loginStatus.verified) {
    await signOut(auth);
  }

  return loginStatus;
};

export { registerAccount, loginAccount };
