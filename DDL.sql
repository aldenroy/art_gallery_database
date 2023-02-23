SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

--------------------
-- Table Creation --
--------------------

CREATE OR REPLACE TABLE Patrons 
(
    patron_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    email varchar(45) NOT NULL,
    address varchar(45) NOT NULL,
    is_artist tinyint(1) NOT NULL,
    PRIMARY KEY (patron_id)
);

CREATE OR REPLACE TABLE Transactions
(
    transaction_id int NOT NULL AUTO_INCREMENT,
    patron_id int NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (patron_id) REFERENCES Patrons(patron_id)
);

CREATE OR REPLACE TABLE Artworks
(
    artwork_id int NOT NULL AUTO_INCREMENT,
    title varchar(100) NOT NULL,
    artist_id int NOT NULL,
    price int NOT NULL,
    medium varchar(45) NOT NULL,
    dimensions varchar(45) NOT NULL,
    transaction_id int NULL,
    description varchar(500),
    PRIMARY KEY (artwork_id),
    FOREIGN KEY (artist_id) REFERENCES Patrons(patron_id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id)
);

CREATE OR REPLACE TABLE Frames
(
    frame_id varchar(45) NOT NULL,
    price int NOT NULL,
    inventory int NOT NULL,
    PRIMARY KEY (frame_id)
);

CREATE OR REPLACE TABLE Transactions_Has_Frames
(
    transaction_id int,
    frame_id varchar(45),
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (frame_id) REFERENCES Frames(frame_id) ON UPDATE CASCADE ON DELETE CASCADE
);

------------------------
-- Adding Sample Data --
------------------------

INSERT INTO Patrons
(
    first_name,
    last_name,
    email,
    address,
    is_artist
)
VALUES
(
    "Hunter",
    "Cram",
    "huntercooks@goodfood.com",
    "156 S Pan St",
    0
),
(
    "Ryan",
    "Dillard",
    "rdillard@garmen.biz",
    "561 Takeoff Ave",
    0
),
(
    "Connor",
    "Kealey",
    "creations@connorkealey.design",
    "101 Art Dr",
    1
),
(
    "D",
    "Tilson",
    "artpdf@tilson.graphics",
    "189 Kirkland St",
    1
),
(
    "Benny",
    "Beaver",
    "is@sortacreepy.com",
    "147 Monroe Ave",
    0
),
(
    "Alex",
    "Koetje",
    "alex@darling.beads",
    "11 Taco St",
    1
),
(
    "April",
    "Friend",
    "april@good.vibes",
    "137 Portland Place",
    1
);

INSERT INTO Artworks
(
    title,
    artist_id,
    price,
    medium,
    dimensions,
    description
)
VALUES
(
    "Fishnets",
    (SELECT patron_id from Patrons WHERE first_name = "Connor" AND last_name = "Kealey"),
    5000,
    "Digital",
    "27x40",
    "Woman wearing a diving helmate"
),
(
    "Royal Frog",
    (SELECT patron_id FROM Patrons WHERE first_name = "Alex" AND last_name = "Koetje"),
    10000,
    "Acrylic",
    "10x10",
    "Frog wering a frilled collar"
),
(
    "Otter",
    (SELECT patron_id FROM Patrons WHERE first_name = "D" AND last_name = "Tilson"),
    300,
    "Digital",
    "8.5x11",
    "Low-poly otter floating on its back"
),
(
    "Frog Valley",
    (SELECT patron_id FROM Patrons WHERE first_name = "April" AND last_name = "Friend"),
    4000,
    "Screen Print",
    "11x17",
    "Two frogs having a picnic"
)
;

INSERT INTO Frames
(
    frame_id,
    price,
    inventory
)
VALUES(
    "4x6",
    15,
    30
),
(
    "8x8",
    20,
    64
),
(
    "8.5x11",
    20,
    16
),
(
    "10x10",
    25,
    27
),
(
    "11x17",
    30,
    14
),
(
    "22x28",
    40,
    24
),
(
    "27x40",
    40,
    5
);

------------------------------------------------------------------------------------
-- the follwoing is an example of possible database updates for a single purchase --
------------------------------------------------------------------------------------

INSERT INTO Transactions
(
    patron_id,
    date
)
VALUES(
    (SELECT patron_id from Patrons WHERE first_name = "Hunter" AND last_name = "Cram"),
    "2023-01-02"
);

-- Hunter Cram has decided to purchase two pieces of art
UPDATE Artworks
SET transaction_id = (
    SELECT patron_id
    FROM Patrons
    WHERE first_name = "Hunter" 
    AND last_name = "Cram" 
)
WHERE title = "Fishnets" OR title = "Otter";

-- as well as a frame for each
INSERT INTO Transactions_Has_Frames
(
    transaction_id,
    frame_id
)
VALUES(
    1, -- Hard Coded
    (SELECT dimensions FROM Artworks WHERE title = "Fishnets")
),
(
    1, -- Hard Coded
    (SELECT dimensions FROM Artworks WHERE title = "Otter")
);


---------------------
-- 2nd Transaction --
---------------------

INSERT INTO Transactions
(
    patron_id,
    date
)
VALUES(
    (SELECT patron_id from Patrons WHERE first_name = "Connor" AND last_name = "Kealey"),
    "2022-12-20"
);

-- Connor Kealey has decided to purchase one pieces of art
UPDATE Artworks
SET transaction_id = (
    SELECT patron_id
    FROM Patrons
    WHERE first_name = "Connor" 
    AND last_name = "Kealey" 
)
WHERE title = "Royal Frog";

-- as well one frame
INSERT INTO Transactions_Has_Frames
(
    transaction_id,
    frame_id
)
VALUES(
    2, -- Hard Coded
    (SELECT dimensions FROM Artworks WHERE title = "Royal Frog")
);

---------------------
-- 3rd Transaction --
---------------------

INSERT INTO Transactions
(
    patron_id,
    date
)
VALUES(
    (SELECT patron_id from Patrons WHERE first_name = "Benny" AND last_name = "Beaver"),
    "2023-02-06"
);

-- Benny Beaver has decided to purchase one pieces of art
UPDATE Artworks
SET transaction_id = (
    SELECT patron_id
    FROM Patrons
    WHERE first_name = "Benny" 
    AND last_name = "Beaver" 
)
WHERE title = "Frog Valley";

-- as well one frame
INSERT INTO Transactions_Has_Frames
(
    transaction_id,
    frame_id
)
VALUES(
    3, -- Hard Coded
    (SELECT dimensions FROM Artworks WHERE title = "Frog Valley")
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;