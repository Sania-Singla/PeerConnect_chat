create table followers (
	following_id varchar(40),
	follower_id varchar(40),
	CONSTRAINT followers_pk PRIMARY KEY(following_id, follower_id),
	CONSTRAINT followers_channel_id_fk FOREIGN KEY(following_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT followers_follower_id_fk FOREIGN KEY(follower_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);