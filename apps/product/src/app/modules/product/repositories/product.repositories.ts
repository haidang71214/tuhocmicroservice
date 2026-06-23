import { Product } from '@common/entities/product.entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  async create(data: Partial<Product>): Promise<Product> {
    const { sku, name } = data;
    const exists = await this.repo.findOne({ where: { sku, name } });
    if (exists) throw new BadRequestException('product alredy exist');
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }
  async findAll(): Promise<Product[]> {
    return await this.repo.find();
  }
  async findById(id: number): Promise<Product> {
    return await this.repo.findOne({ where: { id } });
  }
  async checkSku(sku: string): Promise<boolean> {
    const result = await this.repo.findOne({ where: { sku } });
    return !!result;
  }
  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const result = await this.repo.update(id, data);
    if (result.affected === 0) return null;
    return await this.findById(id);
  }
  async exists(sku: string, name: string): Promise<boolean> {
    const result = await this.repo.findOne({ where: { sku, name } });
    return !!result;
  }
}
