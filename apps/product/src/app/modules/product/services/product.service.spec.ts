import { ProductRepository } from '../repositories/product.repositories';
import { ProductService } from './product.service';
import { TestingModule, Test } from '@nestjs/testing';
import { CreateProductTCPRequest } from '@common/interfaces/tcp/product';
import { BadRequestException } from '@nestjs/common';
import { Response } from '@common/interfaces/tcp/common/response.interface';

describe('ProductService', () => {
  // phần này mình sẽ inject những thứ bên trong product service vô
  let service: ProductService;
  let repository: ProductRepository;
  // phần này mình sẽ giả lập các hàm của repository mà service sử dụng
  const mockProductRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  };
  // hàm ở dưới là hàm giả lập module với các tham số provuder là 2 cái kia đi kèm phương thức
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
    // ở đây mình phải clear vì sẽ có những trường hợp mà ở đó cái testing module
    // nó đang call t
    jest.clearAllMocks();
  });
  // đây là hàm kiểm thử cơ bản xem cái service có được khởi tạo hay không
  it('should create a define', () => {
    expect(service).toBeDefined();
  });
  // tạo data giả lập
  describe('create', () => {
    const createDto: CreateProductTCPRequest = {
      sku: 'SKU-001',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      unit: 'pcs',
      vatRate: 10,
    };
    // thử trường hợp 1
    it('should create a product successfully when it does not exist', async () => {
      mockProductRepository.exists.mockResolvedValue(false); // giả lập trường hợp là exit false -> thì nó sẽ lưu xuống db
      mockProductRepository.create.mockResolvedValue({
        // match với data và create cái repository
        id: 1,
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // sau đó mới tới phần createProductService
      const result = await service.createProductService(createDto);
      // đầu tiên là kiểm tra xem ở repository nó có tồn tại không
      expect(repository.exists).toHaveBeenCalledWith(createDto.sku, createDto.name);
      // kiểm tra xem ở repository xem nó có được create không
      expect(repository.create).toHaveBeenCalledWith(createDto);
      // kiểm tra xemm dữ liệu có tương đồng không
      expect(result).toEqual(
        Response.success({
          id: 1,
          ...createDto,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    // thử trường hợp 2
    it('should throw BadRequestException when product already exists', async () => {
      // trường hợp mà tồn tại trả về true
      mockProductRepository.exists.mockResolvedValue(true);
      // những thứ được kì vọng
      await expect(service.createProductService(createDto)).rejects.toThrow(BadRequestException);
      // cái đằng trên lỗi thì cái dưới không được gọi
      expect(repository.exists).toHaveBeenCalledWith(createDto.sku, createDto.name);
      // lỗi lun
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('getList', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          id: 1,
          sku: 'SKU-1',
          name: 'P1',
          price: 100,
          unit: 'pcs',
          vatRate: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          sku: 'SKU-2',
          name: 'P2',
          price: 200,
          unit: 'box',
          vatRate: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await service.getAllProductsService();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(Response.success(mockProducts));
    });
  });
});
