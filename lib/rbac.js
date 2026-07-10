import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ADMIN_EMAILS } from './constants';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

/**
 * Validates a user's role.
 * Super Admins (defined in constants.js) always have maximum access.
 * Others are checked against the 'roles' collection in Firestore.
 */
export const getUserRole = async (email) => {
  if (!email) return null;
  
  if (ADMIN_EMAILS.includes(email)) {
    return ROLES.SUPER_ADMIN;
  }

  try {
    const roleDoc = await getDoc(doc(db, 'roles', email));
    if (roleDoc.exists()) {
      return roleDoc.data().role;
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
  }
  
  return null;
};

/**
 * Checks if a user has permission to perform an action based on their role.
 */
export const hasPermission = (userRole, requiredRole) => {
  if (userRole === ROLES.SUPER_ADMIN) return true;
  if (userRole === ROLES.EDITOR && (requiredRole === ROLES.EDITOR || requiredRole === ROLES.VIEWER)) return true;
  if (userRole === ROLES.VIEWER && requiredRole === ROLES.VIEWER) return true;
  return false;
};
