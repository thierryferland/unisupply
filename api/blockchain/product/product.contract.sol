pragma solidity ^0.8.0;

contract Product {
    struct ProductItem {
        string name;
        uint256 price;
        string description;
        string unitOfMeasure;
    }

    mapping(uint256 => ProductItem) public products;
    uint256 public productCount;

    function createProduct(string memory _name, uint256 _price, string memory _description, string memory _unitOfMeasure) public {
        productCount++;
        products[productCount] = ProductItem(_name, _price, _description, _unitOfMeasure);
    }

    function getProduct(uint256 _id) public view returns (string memory, uint256, string memory, string memory) {
        ProductItem memory item = products[_id];
        return (item.name, item.price, item.description, item.unitOfMeasure);
    }
}
