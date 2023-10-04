// CoinTransfer.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './Firebase';

const CoinTransfer = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [userBalance, setUserBalance] = useState(null);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const balance = userSnapshot.data().balance;
            console.log('Fetched user balance:', balance);
            setUserBalance(balance);
          } else {
            console.warn('User document not found');
          }
        } else {
          console.error('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching user balance:', error.message);
      }
    };

    fetchUserBalance();
  }, []); // Run only once on component mount

  const handleTransfer = async () => {
    try {
      // Check if user balance is available before proceeding
      if (userBalance === null) {
        console.error('User balance not available');
        return;
      }

      // Convert amount to a number
      const transferAmount = Number(amount);

      // Validate the transfer amount
      if (isNaN(transferAmount) || transferAmount <= 0) {
        console.error('Invalid transfer amount');
        return;
      }

      // Check if the user has sufficient balance
      if (transferAmount > userBalance) {
        console.error('Insufficient balance');
        return;
      }

      // Fetch recipient user by email
      const recipientQuery = await getDoc(doc(db, 'users', 'your-collection-id', 'your-document-id')); // Replace with your actual collection and document IDs
      const recipient = recipientQuery.data();

      // Update recipient balance
      if (recipient) {
        const recipientBalance = recipient.balance + transferAmount;
        await updateDoc(doc(db, 'users', 'your-collection-id', 'your-document-id'), { balance: recipientBalance }); // Replace with your actual collection and document IDs
        console.log('Recipient balance updated successfully');
      } else {
        console.error('Recipient not found');
        return;
      }

      // Update user balance
      const updatedUserBalance = userBalance - transferAmount;
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { balance: updatedUserBalance });
      console.log('User balance updated successfully');

      // Update local state
      setUserBalance(updatedUserBalance);

      alert(`Coins transferred successfully!`);
    } catch (error) {
      console.error('Error transferring coins:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Coin Transfer</h2>
      <div>
        <label>Recipient Email: </label>
        <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
      </div>
      <div>
        <label>Amount: </label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <p>Your Balance: {userBalance !== null ? userBalance : 'Loading...'}</p>
      </div>
      <div>
        <button onClick={handleTransfer}>Transfer Coins</button>
      </div>
    </div>
  );
};

export default CoinTransfer;
