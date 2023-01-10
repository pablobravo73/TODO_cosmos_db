const CosmosClient = require('@azure/cosmos').CosmosClient;
const debug = require('debug')('todo-cosmos:task');

let partitionKey = undefined

// Este es el modelo de datos
class Task {
    /**
     * Lee, añade y actualiza tareas en Cosmos DB
     * @param {CosmoClient} CosmosClient 
     * @param {string} databaseID 
     * @param {string} containerid 
     */
    constructor(CosmosClient, databaseID, containerid) {
        this.client = CosmosClient;
        this.databaseID = databaseID;
        this.containerid = containerid;

        this.database = null;
        this.container = null;
    
    }
    async init() {
        debug("Inicializando la base de datos");

        const dbResponse = await this.client.databases.createIfNotExists({
            id: this.databaseID
        })
        this.database = dbResponse.database;
        debug("inicializando contenedor...");
        const contResponse = await this.database.containers.createIfNotExists({
            id: this.containerid
        });
        this.container = contResponse.container;
    }
    /**
     * Encunetra un objeto en la BD
     * @param {string} querySpec 
     */
    async find(querySpec) {
        debug("Buscando en la base de datos");
        if(!this.container){
            throw new Error("Contenedor no se ha inicilizado");
        }
        const { resources } = await this.container.items.query
        (querySpec).fetchAll();

        return resources;
    }

    /**
     * Crea el item enviando en Cosmos DB
     * @param {} item 
     * @returns {resource} Item creado en la BD
     */
    async addItem(item) {
        debug("Añadiendo item a la BD");
        item.date = Date.now();
        item.completed = false;
        const { resource: doc } = await this.container.items.create(item);

        return doc;
    }

    /**
     * 
     * @param {string} itemID 
     * @returns 
     */
    async updateItem(itemID) {
        debug("Actualizando item");
        const doc = await this.getItem(itemID);
        doc.completed = true;

        const { resource: replaced } = await this.container
        .item(itemID, partitionKey)
        .replace(doc)

        return replaced;
    }

    /**
     * 
     * @param {string} itemID 
     * @returns 
     */
    async getItem(itemID) {
        debug("Buscando item en la BD");
        const { resource } = await this.container.item(itemID, partitionKey);
        return resource
    }
}

module.exports = Task;