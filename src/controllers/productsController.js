const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeProducts = (data) => fs.writeFileSync(productsFilePath, JSON.stringify(data), 'utf-8')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let product = products.find(product => product.id === +req.params.id);

		res.render('detail', {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let lastId = 0;
		products.forEach(product => {
			if (product.id > lastId) {
				lastId = product.id
			}
		});
		
		
		let newProduct = {
			...req.body,
			id : lastId +1,
			image: req.file ? req.file.filename : "default-image.png"
		}

		products.push(newProduct)

		writeProducts(products)

		res.send(`el producto ${req.body.name} ah sido creado exitosamente`)
	},

	// Update - Form to edit
	edit: (req, res) => {
		let product = products.find(product => product.id === +req.params.id);
		res.render('product-edit-form', {
			product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let productId = +req.params.id;
		/* products.forEach(product => {
			if (product.id === productId) {
				product.price = +req.body.price
				product.discount = +req.body.discount
				product.category = req.body.category
				product.description = req.body.description
				product.image = req.body.iamge ? "default-image.png" : product.image;
			}

		}); */
		products = products.map(product => 
			product.id === productId? {id:product.id, ...req.body, image: product.image} : product);

		/* const {name,price,discount,category, description} = req.body;
		products.forEach(product => {
			if (product.id === productId) {
				product.name = name
				product.price = price
				product.discount = discount
				product.category = category
				product.description = description
			}
		});	 */

		writeProducts(products);
		res.send('modificaste el producto ' + req.body.name + " exitosamente")
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {

		//let productDelete = products.find(product => product.id === +req.params.id);
		let productDelete;
		
		products.forEach(product => {
			if (product.id === +req.params.id) {
				productDelete = product.name;
				let productDeleteIndex = products.indexOf(product);
				products.splice(productDeleteIndex, 1)
			}
		})

		writeProducts(products);
		
		res.send(`eliminaste el producto: ${productDelete}`)
	}
};

module.exports = controller;