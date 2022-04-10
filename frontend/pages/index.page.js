import React from 'react';

export default function Home() {
  return (
    <>
      <h1 className="capitalize text-xl">News Dao</h1>
      <p>
        News DAO is a toolkit that allows DAOs to create and manage their own
        social media profile. It provides a set of primitives for publishing
        permissions, such as majority voting, whitelist addresses, and more.
        Users can also create and add their own modules.
        <br />
        <br />
        An example use case is FakeNewsDAO - a hypothetical DAO focused on
        publishing crowd-vetted news about the covid pandemic. As described
        above, anybody can join the DAO and suggest news to be published, but
        the DAO needs to reach consensus that a particular news piece is
        legitimate, before it can be pushed out to the wider public. No more
        fake news, thanks to the power of the crowd!
      </p>
    </>
  );
}
