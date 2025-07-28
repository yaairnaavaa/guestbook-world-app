// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title WorldChainGuestbook
 * @dev A simple decentralized guestbook for the World Chain community
 * @author World Chain Developer
 */
contract WorldChainGuestbook {
    // Struct to represent a guestbook entry
    struct GuestbookEntry {
        uint256 id;
        address author;
        string name;
        string message;
        uint256 timestamp;
    }
    
    // State variables
    mapping(uint256 => GuestbookEntry) public entries;
    uint256 public entryCount;
    uint256 public constant MAX_MESSAGE_LENGTH = 500;
    uint256 public constant MAX_NAME_LENGTH = 50;
    
    // Events
    event EntryAdded(
        uint256 indexed entryId,
        address indexed author,
        string name,
        string message,
        uint256 timestamp
    );
    
    // Constructor
    constructor() {
        entryCount = 0;
    }
    
    /**
     * @dev Add a new entry to the guestbook
     * @param _name The name of the person leaving the message
     * @param _message The message content
     */
    function addEntry(string memory _name, string memory _message) external {
        require(bytes(_name).length > 0 && bytes(_name).length <= MAX_NAME_LENGTH, "Invalid name length");
        require(bytes(_message).length > 0 && bytes(_message).length <= MAX_MESSAGE_LENGTH, "Invalid message length");
        
        entryCount++;
        
        entries[entryCount] = GuestbookEntry({
            id: entryCount,
            author: msg.sender,
            name: _name,
            message: _message,
            timestamp: block.timestamp
        });
        
        emit EntryAdded(entryCount, msg.sender, _name, _message, block.timestamp);
    }
    
    /**
     * @dev Get a specific entry by ID
     * @param _entryId The ID of the entry to retrieve
     * @return The guestbook entry
     */
    function getEntry(uint256 _entryId) external view returns (GuestbookEntry memory) {
        require(_entryId > 0 && _entryId <= entryCount, "Invalid entry ID");
        return entries[_entryId];
    }
    
    /**
     * @dev Get all entries (paginated, newest first)
     * @param _offset Starting index
     * @param _limit Maximum number of entries to return
     * @return Array of guestbook entries
     */
    function getEntries(uint256 _offset, uint256 _limit) external view returns (GuestbookEntry[] memory) {
        require(_limit > 0 && _limit <= 100, "Invalid limit");
        require(_offset < entryCount, "Offset out of bounds");
        
        uint256 resultSize = _limit;
        if (_offset + _limit > entryCount) {
            resultSize = entryCount - _offset;
        }
        
        GuestbookEntry[] memory result = new GuestbookEntry[](resultSize);
        
        // Get entries in reverse order (newest first)
        for (uint256 i = 0; i < resultSize; i++) {
            uint256 entryId = entryCount - _offset - i;
            result[i] = entries[entryId];
        }
        
        return result;
    }
    
    /**
     * @dev Get all entries from a specific user
     * @param _user The address of the user
     * @return Array of guestbook entries from the user
     */
    function getEntriesByUser(address _user) external view returns (GuestbookEntry[] memory) {
        // First, count entries by this user
        uint256 userEntryCount = 0;
        for (uint256 i = 1; i <= entryCount; i++) {
            if (entries[i].author == _user) {
                userEntryCount++;
            }
        }
        
        // Create array with exact size
        GuestbookEntry[] memory userEntries = new GuestbookEntry[](userEntryCount);
        uint256 index = 0;
        
        // Fill array with user's entries (newest first)
        for (uint256 i = entryCount; i >= 1 && index < userEntryCount; i--) {
            if (entries[i].author == _user) {
                userEntries[index] = entries[i];
                index++;
            }
        }
        
        return userEntries;
    }
    
    /**
     * @dev Get the total number of entries
     * @return The total count of entries
     */
    function getTotalEntries() external view returns (uint256) {
        return entryCount;
    }
    
    /**
     * @dev Get the latest entries (convenience function)
     * @param _count Number of latest entries to return (max 20)
     * @return Array of latest guestbook entries
     */
    function getLatestEntries(uint256 _count) external view returns (GuestbookEntry[] memory) {
        require(_count > 0 && _count <= 20, "Count must be between 1 and 20");
        
        if (entryCount == 0) {
            return new GuestbookEntry[](0);
        }
        
        uint256 resultSize = _count > entryCount ? entryCount : _count;
        GuestbookEntry[] memory result = new GuestbookEntry[](resultSize);
        
        // Get latest entries
        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = entries[entryCount - i];
        }
        
        return result;
    }
}
