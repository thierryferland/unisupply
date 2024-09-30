pragma solidity ^0.8.26;

contract Product {
    
    address public supplier;
    address public productAddress;

    struct ProductInfo {
        string name;
        uint256 price;
        string description;
        string unitOfMeasure;
        bool isActive;
    }

    ProductInfo public productInfo;

    constructor(address _supplier, string memory _name, uint256 _price, string memory _description, string memory _unitOfMeasure) {
        supplier = _supplier;
        productInfo.name = _name;
        productInfo.price = _price;
        productInfo.description = _description;
        productInfo.unitOfMeasure = _unitOfMeasure;
        productInfo.isActive = true;
    }

    event ProductUpdated(string name, uint256 price);

    modifier onlySupplier() {
        require(msg.sender == supplier, "Only the supplier can call this function");
        _;
    }

    function updateProduct(string memory _name, uint256 _price, string memory _description, string memory unitOfMeasure) public onlySupplier {
        productInfo.name = _name;
        productInfo.price = _price;
        productInfo.description = _description;
        productInfo.unitOfMeasure = unitOfMeasure;
        emit ProductUpdated(_name, _price);
    }
}