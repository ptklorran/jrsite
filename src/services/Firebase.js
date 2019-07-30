import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyA1jgl7gMm8ZVcaaiArezM3n40aHtxtqJg",
  authDomain: "investfaciloficial.firebaseapp.com",
  databaseURL: "https://investfaciloficial.firebaseio.com",
  projectId: "investfaciloficial",
  storageBucket: "investfaciloficial.appspot.com",
  messagingSenderId: "840442167066"
}

const f = firebase.initializeApp(config)

export const db = f.database()
export const auth = f.auth()
export const storage = f.storage()
