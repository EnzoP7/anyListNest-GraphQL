import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item,{ name: 'createItem' })
  async createItem(@Args('createItemInput') createItemInput: CreateItemInput,
  @CurrentUser() user: User
  ):Promise<Item> {
    return this.itemsService.create(createItemInput,user);
  }

  @Query(() => [Item], { name: 'items' })
 async findAll(@CurrentUser() user: User,
 @Args() paginationsArgs:PaginationArgs,
 @Args() searchArgs:SearchArgs,
 ) :Promise<Item[]> {
    return this.itemsService.findAll(user,paginationsArgs,searchArgs);
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => ID }) id: string,
  @CurrentUser() user: User) :Promise<Item> {
    return this.itemsService.findOne(id,user);
  }

  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput,
  @CurrentUser() user: User
  ) :Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput,user);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => ID }) id: string,
  @CurrentUser() user: User) :Promise<Item> {
    return this.itemsService.remove(id,user);
  }
}
