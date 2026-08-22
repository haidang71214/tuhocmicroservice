import { ProductRepository } from './repositories/product.repositories';
import { ProductController } from './controllers/product.controller';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@common/entities/product.entities';
import { ProductService } from './services/product.service';
import { CreateProductTCPRequest } from '@common/interfaces/tcp/product';
import { HttpStatus } from '@nestjs/common';

describe('Product Integration', () => {
  let controller: ProductController;
  let repository: ProductRepository;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:16-alpine').start();
    // làm test connection cho postgre
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: postgresContainer.getHost(),
          port: postgresContainer.getPort(),
          username: postgresContainer.getUsername(),
          password: postgresContainer.getPassword(),
          database: postgresContainer.getDatabase(),
          entities: [Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      controllers: [ProductController],
      providers: [ProductService, ProductRepository],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    repository = module.get<ProductRepository>(ProductRepository);
  }, 60000);

  // beforeAll là chạy trước tất cả testcase
  // afterAll là chạy sau tất cả testcase -> dọn dẹp container đó
  afterAll(async () => {
    if (postgresContainer) {
      await postgresContainer.stop();
    }
  });
  // dọn dẹp data trong repository sau mỗi lần chạy
  afterEach(async () => {
    const allProducts = await repository.findAll();
    for (const product of allProducts) {
      await repository.remove(product.id);
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a product', async () => {
    const createDto: CreateProductTCPRequest = {
      name: 'test product',
      sku: 'test-sku',
      price: 100,
      unit: 'pcs',
      vatRate: 10,
    };
    // so sánh cái create ở controller với data mẫu xem có ok không
    const response = await controller.createProduct(createDto);
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.data).toBeDefined();
    expect(response.data.name).toBe(createDto.name);
    expect(response.data.sku).toBe(createDto.sku);

    if (response.data.id) {
      const expectResult = await repository.findById(response.data.id);
      expect(expectResult).toBeDefined();
      expect(expectResult.name).toBe(createDto.name);
    }
  });

  it('should get list of products', async () => {
    await repository.create({
      name: 'Product 1',
      sku: 'SKU-1',
      price: 10,
      unit: 'pcs',
      vatRate: 10,
    });
    await repository.create({
      name: 'Product 2',
      sku: 'SKU-2',
      price: 20,
      unit: 'box',
      vatRate: 8,
    });

    const responselist = await controller.getAllProducts();
    expect(responselist.statusCode).toBe(HttpStatus.OK);
    expect(responselist.data).toHaveLength(2);
    expect(responselist.data.find((p) => p.sku === 'SKU-1')).toBeDefined();
    expect(responselist.data.find((p) => p.sku === 'SKU-2')).toBeDefined();
  });
});
