// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./Product.sol";

contract Supplier {
    address public owner;
    mapping(address => Product) public products;
    address[] public productAddresses;

    event ProductAdded(address productAddress, string name, uint256 price);
    event AllProductsDeleted();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function addProduct(string memory _name, uint256 _price, string memory _description, string memory _unitOfMeasure) public onlyOwner {
        Product newProduct = new Product(msg.sender, _name, _price, _description, _unitOfMeasure);
        products[address(newProduct)] = newProduct;
        productAddresses.push(address(newProduct));
        emit ProductAdded(address(newProduct), _name, _price);
    }

    function deleteAllProducts() public onlyOwner {
        for (uint i = 0; i < productAddresses.length; i++) {
            delete products[productAddresses[i]];
        }
        delete productAddresses;
        emit AllProductsDeleted();
    }

    struct FullProductInfo {
        address productAddress;
        Product.ProductInfo productInfo;
    }

    function getProducts() public view returns (FullProductInfo[] memory) {
        uint256 count = productAddresses.length;
        FullProductInfo[] memory allProducts = new FullProductInfo[](count);
        address[] memory allProductAddresses = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            Product product = products[productAddresses[i]];
            (
                string memory name,
                uint256 price,
                string memory description,
                string memory unitOfMeasure,
                bool isActive
            ) = product.productInfo();

            allProducts[i] = FullProductInfo({
                productAddress: productAddresses[i],
                productInfo: Product.ProductInfo(
                    name,
                    price,
                    description,
                    unitOfMeasure,
                    isActive
                )
            });
        }

        return (allProducts);
    }

    function getProductCount() public view returns (uint256) {
        return productAddresses.length;
    }
}