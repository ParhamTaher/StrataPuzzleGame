DROP TABLE IF EXISTS stUser;
CREATE TABLE stUser (
  Username varchar(30) NOT NULL,
  Password varchar(30) NOT NULL,
  Description varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE stUser ADD PRIMARY KEY (Username);

DROP TABLE IF EXISTS stPattern;
CREATE TABLE stPattern (
  PID int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Name varchar(30) NOT NULL,
  Username varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE stPattern ADD FOREIGN KEY (Username) REFERENCES stUser(Username);


DROP TABLE IF EXISTS stSolution;
CREATE TABLE stSolution (
  PID int(11) NOT NULL,
  EntryNumber int(11) NOT NULL,
  Color varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



ALTER TABLE stSolution ADD FOREIGN KEY (PID) REFERENCES stPattern(PID);
