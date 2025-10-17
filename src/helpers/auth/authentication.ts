import {getWalletConnector} from './walletConnector';

let walletConnector = getWalletConnector();

export async function connectWallet(): Promise<any | null> {

  try {
    const connection = await walletConnector.connectWallet();

  //   // Store wallet address globally for profile functions
  //   (window as any).currentWalletAddress = connection.account;
  //
  //   // The walletConnector already handles server authentication in its connectWallet method
  //   // Now check if user has a profile setup
  //   const currentAccount = walletConnector.getCurrentAccount();
  //   if (currentAccount) {
  //     try {
  //       // Try to get user profile
  //       console.log('Attempting to get user profile for:', currentAccount);
  //       const profile = await getUserProfile(currentAccount);
  //       console.log('Profile retrieved successfully:', profile);
  //
  //       if (!profile.hasUsername) {
  //         // Show profile setup modal
  //         console.log('User needs to set up profile, showing modal...');
  //         showProfileSetup(currentAccount, async (profileData) => {
  //           try {
  //             const updatedProfile = await updateUserProfile(profileData.walletAddress, profileData.username);
  //
  //             // Update auth data with new profile
  //             const updatedUser = {
  //               id: updatedProfile.id,
  //               email: updatedProfile.walletAddress,
  //               walletAddress: updatedProfile.walletAddress,
  //               username: updatedProfile.username,
  //               balance: updatedProfile.balance
  //             };
  //
  //             await setAuthData(updatedUser);
  //             console.log('Profile updated and auth data set');
  //
  //             // Update UI with new profile data
  //             await updateUI(updatedUser);
  //
  //             showError(`Welcome, ${updatedProfile.username}!`);
  //           } catch (error) {
  //             console.error('Error updating profile:', error);
  //             showError('Failed to update profile. Please try again.');
  //           }
  //         });
  //
  //         // Return the basic user object for immediate UI update
  //         const basicUser = {
  //           id: profile.id,
  //           email: profile.walletAddress,
  //           walletAddress: profile.walletAddress,
  //           username: null,
  //           balance: profile.balance
  //         };
  //         return basicUser as any;
  //
  //       } else {
  //         // User already has profile, using existing data
  //         console.log('User already has profile, using existing data');
  //         const existingUser = {
  //           id: profile.id,
  //           email: profile.walletAddress,
  //           walletAddress: profile.walletAddress,
  //           username: profile.username,
  //           balance: profile.balance
  //         };
  //
  //         await setAuthData(existingUser);
  //         await updateUI(existingUser);
  //       }
  //
  //     } catch (profileError) {
  //       console.error('Error fetching profile:', profileError);
  //       // This is likely a first-time user - show profile setup modal
  //       console.log('Profile fetch failed - likely first-time user, showing profile setup modal...');
  //
  //       // Create a basic user object for immediate UI update
  //       const user = {
  //         id: currentAccount,
  //         email: currentAccount,
  //         walletAddress: currentAccount,
  //         balance: 0
  //       };
  //       await setAuthData(user);
  //
  //       // Show profile setup modal immediately
  //       console.log('About to call showProfileSetup with wallet address:', currentAccount);
  //
  //       showProfileSetup(currentAccount, async (profileData) => {
  //         console.log('Profile setup callback received:', profileData);
  //         try {
  //           const updatedProfile = await updateUserProfile(profileData.walletAddress, profileData.username);
  //           console.log('Profile updated successfully:', updatedProfile);
  //
  //           // Update auth data with new profile
  //           const updatedUser = {
  //             id: updatedProfile.id,
  //             email: updatedProfile.walletAddress,
  //             walletAddress: updatedProfile.walletAddress,
  //             username: updatedProfile.username,
  //             balance: updatedProfile.balance
  //           };
  //           await setAuthData(updatedUser);
  //
  //           // Refresh the UI to show the new profile
  //           await updateUI(updatedUser);
  //
  //           showError(`Welcome, ${updatedProfile.username}!`);
  //         } catch (error) {
  //           console.error('Error updating profile:', error);
  //           showError('Failed to update profile. Please try again.');
  //         }
  //       });
  //
  //       console.log('Profile setup modal should now be visible');
  //
  //       return user as any;
  //     }
  //   }
  //
  //   return null;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    if (errorMessage.includes('User rejected')) {
      // showError('Connection cancelled by user');
      console.error('Connection cancelled by user');
    } else {
      // showError(errorMessage);
      console.error(errorMessage);
    }
    return null;
  }
}