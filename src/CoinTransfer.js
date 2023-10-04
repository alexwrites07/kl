// CoinTransfer.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from './Firebase';

const CoinTransfer = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [userBalance, setUserBalance] = useState(1000);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDoc = doc(db, 'users', user.email); // Assuming email is used as the document ID
          const unsubscribe = onSnapshot(userDoc, (doc) => {
            if (doc.exists()) {
              const balance = doc.data().balance;
              console.log('Fetched user balance:', balance);
              setUserBalance(balance);
            } else {
              console.warn('User document not found');
            }
          });

          return () => unsubscribe();
        } else {
          console.error('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching user balance:', error.message);
      }
    };

    fetchUserBalance();
  }, []); // Run only once on component mount

  const fetchRecipientDetails = async () => {
    try {
      console.log('Fetching recipient details for email:', recipientEmail);

      const recipientQuery = await getDoc(doc(db, 'users', recipientEmail));

      if (recipientQuery.exists()) {
        const recipientData = recipientQuery.data();
        console.log('Fetched recipient details:', recipientData);
        setRecipient(recipientData);
      } else {
        console.warn('Recipient document not found for email:', recipientEmail);
      }
    } catch (error) {
      console.error('Error fetching recipient details:', error.message);
    }
  };

  useEffect(() => {
    if (recipientEmail) {
      fetchRecipientDetails();
    }
  }, [recipientEmail]);

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

      // Check if recipient details are available
      if (!recipient) {
        console.error('Recipient details not available');
        return;
      }

      // Update recipient balance
      const recipientBalance = recipient.balance + transferAmount;
      await updateDoc(doc(db, 'users', recipientEmail), { balance: recipientBalance });

      // Update user balance
      const updatedUserBalance = userBalance - transferAmount;
      await updateDoc(doc(db, 'users', auth.currentUser.email), { balance: updatedUserBalance });

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
        <p>Your Balance: {userBalance !== 1000 ? userBalance : 'Loading...'}</p>
      </div>
      <div>
        <button onClick={handleTransfer}>Transfer Coins</button>
      </div>
    </div>
  );
};

export default CoinTransfer;
