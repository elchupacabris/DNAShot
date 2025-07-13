const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase
admin.initializeApp();

// Simple HTTP function
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Simple Firestore trigger
exports.logNewScores = functions.firestore
  .document('scorecards/{scoreId}')
  .onCreate((snapshot, context) => {
    const newScore = snapshot.data();
    console.log('New score added:', newScore);
    return null;
  });
  // Calculate golf handicap from last 20 scores
exports.calculateHandicap = functions.https.onCall(async (data, context) => {
  // 1. Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Please log in');
  }

  const userId = context.auth.uid;

  // 2. Get last 20 scores
  const scoresSnapshot = await admin.firestore()
    .collection('scorecards')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get();

  // 3. Calculate handicap (simplified version)
  if (scoresSnapshot.empty) {
    return { handicap: null };
  }

  const scores = scoresSnapshot.docs.map(doc => doc.data().score);
  const differentials = scores.map(score => (score - 72) * 0.96);
  const handicap = differentials
    .sort((a, b) => a - b)
    .slice(0, 8) // Take best 8 of last 20
    .reduce((sum, diff) => sum + diff, 0) / 8;

  // 4. Save the handicap
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .update({ 
      handicap: handicap.toFixed(1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp() 
    });

  return { handicap: handicap.toFixed(1) };
});
// Calculate golf handicap from last 20 scores
exports.calculateHandicap = functions.https.onCall(async (data, context) => {
  // 1. Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Please log in');
  }

  const userId = context.auth.uid;

  // 2. Get last 20 scores
  const scoresSnapshot = await admin.firestore()
    .collection('scorecards')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get();

  // 3. Calculate handicap (simplified version)
  if (scoresSnapshot.empty) {
    return { handicap: null };
  }

  const scores = scoresSnapshot.docs.map(doc => doc.data().score);
  const differentials = scores.map(score => (score - 72) * 0.96);
  const handicap = differentials
    .sort((a, b) => a - b)
    .slice(0, 8) // Take best 8 of last 20
    .reduce((sum, diff) => sum + diff, 0) / 8;

  // 4. Save the handicap
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .update({ 
      handicap: handicap.toFixed(1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp() 
    });

  return { handicap: handicap.toFixed(1) };
});