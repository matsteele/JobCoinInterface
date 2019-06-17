import React from "react"
import { connect } from "react-redux"

import { fetchUser } from "../actions/userActions"
import { fetchTweets } from "../actions/tweetsActions"

import styled from '@emotion/styled'

@connect((store) => {
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    tweets: store.tweets.tweets,
  };
})
export default class Layout extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchUser())
  }

  fetchTweets() {
    this.props.dispatch(fetchTweets())
  }

  render() {
    const { user, tweets } = this.props;
    const thisIsBlue = "blue"
    const StyledButton = styled('button')({
      padding: 32,
      backgroundColor: "hotpink",
      fontSize: 24,
      borderRadius: 4,
      '&:hover': {
        color: thisIsBlue,
      }
    })


    if (!tweets.length) {
      return <StyledButton
        onClick={this.fetchTweets.bind(this)}>
        load tweets
      </StyledButton>
    }

    const mappedTweets = tweets.map(tweet => <li key={tweet.id}>{tweet.text}</li>)

    return <div>
      <h1>{user.name}</h1>
      <ul>{mappedTweets}</ul>
    </div>
  }
}
