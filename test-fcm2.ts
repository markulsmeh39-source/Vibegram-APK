import admin from 'firebase-admin';

async function test() {
  try {
    admin.initializeApp({
       projectId: 'straight-dream-4sjh2'
    });
    console.log('Firebase admin initialized for project straight-dream-4sjh2.');
    
    // Try sending a dry-run message
    const response = await admin.messaging().send({
      token: 'fake-token-123',
      notification: { title: 'Test' }
    }, true);
    console.log('Send response:', response);
  } catch (err: any) {
    console.error('FAILED:', err.message, err.code);
  }
}

test();
