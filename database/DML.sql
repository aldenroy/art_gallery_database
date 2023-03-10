-- Insert queries for all tables
INSERT INTO Patrons (patron_id, first_name, last_name, email, address, is_artist)
VALUES (:patron_id, :first_name, :last_name, :email, :address, :is_artist);

INSERT INTO Transactions (transaction_id, patron_id, date)
VALUES (:transaction_id, :patron_id, :date);

INSERT INTO Artworks (artwork_id, title, artist_id, price, medium, dimensions, transaction_id, description)
VALUES (:artwork_id, :title, :artist_id, :price, :medium, :dimensions, :transaction_id, :description);

INSERT INTO Frames (frame_id, price, inventory)
VALUES (:frame_id, :price, :inventory);

-- Selects for all tables
SELECT patron_id, first_name, last_name, email, address, is_artist FROM Patrons;

SELECT transaction_id, patron_id, date FROM Transactions;

SELECT artwork_id, title, artist_id, price, medium, dimensions, transaction_id, description FROM Artworks;

SELECT frame_id, price, inventory FROM Frames;

-- Create select for transaction table
SELECT Transactions.date AS Transactions, Frames.price AS Frames
FROM Transactions
JOIN Transactions_Has_Frames
ON Transaction.transaction_id = Transactions_Has_Frames.transaction_id
JOIN Frames
ON Frames.frame_id = Transactions_Has_Frames.frame_id

-- update once connor is done to have sets fr dropdown vals
-- Update query for tables as well as delete
UPDATE Patrons
SET patron_id = :patron_id, first_name = :first_name, last_name = :last_name, email = :email, address = :address, is_artist = :is_artist
WHERE id = patron_id_from_form;

DELETE FROM Patrons
WHERE id = :patron_id_from_delete_form;

UPDATE Transactions
SET transaction_id = transaction_id = :transaction_id, patron_id = :patron_id, date = :date
WHERE id = transaction_id_from_form;

DELETE FROM Transactions
WHERE id = :transaction_id_from_delete_form;

UPDATE Artworks
SET artwork_id = :artwork_id, title = :title, artist_id = :artist_id, price = :price, medium = :medium, dimensions = :dimensions, 
transaction_id = :transaction_id, description = :description
WHERE id = artwork_id_from_form;

DELETE FROM Artworks
WHERE id = :artwork_id_from_delete_form;

UPDATE Frames
SET frame_id = :frame_id, price = :price, inventory = :inventory
WHERE id = frame_id_from_form;

DELETE FROM Transactions
WHERE id = :frame_id_from_delete_form;




