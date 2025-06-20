import type { User, InsertUser, Product, InsertProduct } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getPopularProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private currentUserId: number;
  private currentProductId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.seedProducts();
  }

  private seedProducts() {
    const seedProducts = [
      {
        name: "Rust Arcane External",
        description: "Get the rust arcane external loader.",
        category: "External Tool",
        colorIndicator: "orange",
        downloadUrl: "https://mega.nz/file/ce91FSAT#Uz8n6I-mlY83SmzA277dVdKYA1cMPfLO864UNjlNKSc",
        featured: true,
        popular: true,
      },
      {
        name: "Rust Pro External",
        description: "Advanced rust external with premium features.",
        category: "External Tool",
        colorIndicator: "red",
        downloadUrl: "#",
        featured: true,
        popular: false,
      },
      {
        name: "BO6 Engine",
        description: "Here you can download the loader for the bo6 external",
        category: "External Tool",
        colorIndicator: "green",
        downloadUrl: "https://cdn.discordapp.com/attachments/1366698054777962610/1384497203414040576/BoEngine.exe?ex=68549f40&is=68534dc0&hm=be321a61244f7314244273ef894744ab2865413500feb782775400678093a60a&",
        featured: true,
        popular: false,
      },
      {
        name: "NFA Account Loader",
        description: "NFA account loader for advanced gaming features.",
        category: "Loader",
        colorIndicator: "blue",
        downloadUrl: "https://mega.nz/file/detVgBoS#Ht-AlTpmBuOzVebPK440GiPaKUYFhUJnNsN7T6yINak",
        featured: false,
        popular: true,
      },
      {
        name: "Spoofer",
        description: "Spoofer download to bypass any anticheat.",
        category: "Spoofer",
        colorIndicator: "indigo",
        downloadUrl: "#",
        featured: true,
        popular: true,
      },
    ];

    seedProducts.forEach((product) => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category,
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured === true,
    );
  }

  async getPopularProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.popular === true,
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery),
    );
  }
}

export const storage = new MemStorage();