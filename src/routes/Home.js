import React, { useState, useEffect } from 'react';
import { dbService } from 'fbase';
import Tweet from 'components/Tweet';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    dbService.collection('tweets').onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTweets(tweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection('tweets').add({
      text: tweet,
      createdAt: Date.now(),
      createdId: userObj.uid,
    });
    setTweet('');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  console.log(tweets);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={tweet} onChange={onChange} type="text" placeholder="What`s on your mind?" maxLength={120}></input>
        <input type="submit" value="tweet" />
      </form>
      <div>
        {tweets.map((tomato) => (
          <Tweet key={tomato.id} tweetObj={tomato} isOwner={tomato.createdId === userObj.uid} />
        ))}
      </div>
    </div>
  );
};
export default Home;
