import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let adminApp: App | null = null;
let firestoreDb: Firestore | null = null;

export function getAdminFirestore(): Firestore {
  if (firestoreDb) {
    return firestoreDb;
  }

  try {
    const existingApps = getApps();
    if (existingApps.length === 0) {
      adminApp = initializeApp({
        projectId: firebaseConfig.projectId,
      });
    } else {
      adminApp = existingApps[0];
    }

    const databaseId =
      firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
        ? firebaseConfig.firestoreDatabaseId
        : undefined;

    if (databaseId) {
      firestoreDb = getFirestore(adminApp, databaseId);
    } else {
      firestoreDb = getFirestore(adminApp);
    }
  } catch (err) {
    console.error('[FirebaseAdmin] Failed to initialize Firebase Admin SDK:', err);
    throw err;
  }

  return firestoreDb;
}
export { Firestore };
