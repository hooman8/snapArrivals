const deleteFirstSearchTerm = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("searchTerms", "readwrite");
    const store = transaction.objectStore("searchTerms");

    const request = store.openCursor(); // Open a cursor to find the first record

    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        cursor.delete(); // Delete the first record
        console.log("First search term deleted successfully:", cursor.value);
        resolve(cursor.value); // Resolve with the deleted record value
      } else {
        console.log("No search terms found to delete.");
        resolve(null); // No records found
      }
    };

    request.onerror = (event) => {
      console.error(
        "Error deleting the first search term:",
        event.target.error
      );
      reject("Error deleting the first search term");
    };
  });
};
const countAllSearchTerms = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("searchTerms", "readonly");
    const store = transaction.objectStore("searchTerms");

    const request = store.count(); // Use the count method to get the number of records

    request.onsuccess = () => {
      resolve(request.result); // Return the total count
    };

    request.onerror = (event) => {
      console.error("Error counting search terms:", event.target.error);
      reject("Error counting search terms");
    };
  });
};
const countSearchTermOccurrences = async (term) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("searchTerms", "readonly");
    const store = transaction.objectStore("searchTerms");

    const request = store.openCursor();

    let count = 0; // Counter for matching records

    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        if (cursor.value === term) {
          count++; // Increment the count if the term matches
        }
        cursor.continue(); // Continue to the next record
      } else {
        resolve(count); // Resolve with the count once all records are processed
      }
    };

    request.onerror = (event) => {
      console.error(
        "Error counting occurrences of search term:",
        event.target.error
      );
      reject("Error counting occurrences of search term");
    };
  });
};
