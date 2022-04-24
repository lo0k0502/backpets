import React from 'react';
import { RefreshControl } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useProducts } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import { constants } from '../../../../utils';
import BuyCard from './BuyCard';

export default () => {
    const user = useSelector(selectUser);
    const { allProducts, refreshAllProducts, isFetchingAllProducts } = useProducts();

    const checkProductMatchSearchText = (product) => (
        !user.searchText
        || product.product_name.search(user.searchText) !== -1
        || product.description.search(user.searchText) !== -1
        || product.company_name.search(user.searchText) !== -1
        || product.company_address.search(user.searchText) !== -1
    );

    const passedCheckProducts = allProducts.filter(checkProductMatchSearchText);

    return (
        <>
            {
                !isFetchingAllProducts && !passedCheckProducts.length ? (
                    <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有商品QQ</Title>
                ) : null
            }
            <FlatGrid
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
                contentContainerStyle={{ paddingBottom: 70 }}
                refreshControl={(
                    <RefreshControl
                        refreshing={isFetchingAllProducts}
                        onRefresh={refreshAllProducts}
                    />
                )}
                itemDimension={constants.boxSize}
                data={isFetchingAllProducts ? [] : passedCheckProducts}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <BuyCard product={item} />
                )}
            />
        </>
    )
};