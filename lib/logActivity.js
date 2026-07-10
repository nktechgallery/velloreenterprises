import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Log an activity to Firestore for the admin dashboard.
 * @param {string} action - e.g., 'PRODUCT_CREATED', 'QUOTE_DOWNLOADED', 'INQUIRY_SENT'
 * @param {string} details - Human readable string detailing the action
 * @param {object} meta - Additional metadata
 */
export const logActivity = async (action, details, meta = {}) => {
  try {
    await addDoc(collection(db, 'activity_logs'), {
      action,
      details,
      meta,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
