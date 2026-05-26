import admin from 'firebase-admin';

async function test() {
  try {
    admin.initializeApp();
    console.log('Firebase admin initialized.');
    
    // Try sending a dry-run message
    const response = await admin.messaging().send({
      token: 'fake-token-123',
      notification: { title: 'Test' }
    }, true /* dryRun */);
    console.log('Send response:', response);
  } catch (err: any) {
    if (err.errorInfo && err.errorInfo.code === 'messaging/invalid-registration-token') {
       console.log('SUCCESS! Admin has messaging permissions (returned invalid token).');
    } else {
       console.error('FAILED with error:', err.message, err.code);
    }
  }
}

test();
