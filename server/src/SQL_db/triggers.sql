-- before insert user
DELIMITER $$
CREATE TRIGGER before_insert_user
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE userExists BOOLEAN DEFAULT FALSE;

    SET userExists := EXISTS (SELECT 1 FROM users WHERE user_name = NEW.user_name OR user_email = NEW.user_email);

    IF userExists THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User with Username/Email already exists';
    ELSE 
        -- username
        IF NEW.user_name NOT REGEXP '^[A-Za-z0-9_]{1,20}$' THEN
           SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters, numbers and underscores are allowed and username can not exceed 20 characters';
        END IF;
        
        -- first name
        IF NEW.user_firstName NOT REGEXP '^[A-Za-z]{1,15}$' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters are allowed and first name can not exceed 15 characters';
        END IF;
          
          -- last name
        IF NEW.user_lastName NOT REGEXP '^[A-Za-z]{0,15}$' THEN -- bcz last name can be empty too!
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters are allowed and last name can not exceed 15 characters';
        END IF;

        -- bio
        IF LENGTH(NEW.user_bio) > 100 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bio Should not exceed 100 characters.';
        END IF;
        
        -- email
        IF NEW.user_email NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Please Enter a Valid Email';
        END IF;
    END IF;
END$$
DELIMITER ;

-- before update user
DELIMITER $$
CREATE TRIGGER before_update_users
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN   
	  -- user_name
    IF NEW.user_name NOT REGEXP '^[A-Za-z0-9_]{1,20}$' THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters, numbers and underscores are allowed and username can not exceed 20 characters';
    END IF;
    
    -- first name
    IF NEW.user_firstName NOT REGEXP '^[A-Za-z]{1,15}$' THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters are allowed and first name can not exceed 15 characters';
    END IF;
    
    -- last name
    IF NEW.user_lastName NOT REGEXP '^[A-Za-z]{0,15}$' THEN -- bcz last name can be empty too!
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters are allowed and last name can not exceed 15 characters';
    END IF;

    -- bio
    IF LENGTH(NEW.user_bio)>100 THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bio Should not exceed 100 characters.';
    END IF;
	
    -- email
    IF NEW.user_email NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$' THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Please Enter a Valid Email';
    END IF;
END$$
DELIMITER ;

-- before insert post
DELIMITER $$
CREATE TRIGGER before_insert_post
BEFORE INSERT ON posts
FOR EACH ROW
BEGIN
    IF LENGTH(NEW.post_title) > 100 THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Post Title Should not exceed 100 characters.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER before_update_post
BEFORE UPDATE ON posts
FOR EACH ROW
BEGIN
    SET user_updatedAt = NOW();
		
    IF
END$$
DELIMITER ;