import React, { useContext, useState } from 'react';
import { RefreshControl } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Portal, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useProducts } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import { constants } from '../../../../utils';
import BuyCard from './BuyCard';
import BuyDialog from './BuyDialog';
import Context from '../../../../context';

export default () => {
    const user = useSelector(selectUser);
    const { allProducts, refreshAllProducts, isFetchingAllProducts } = useProducts();
    const { showSnackbar } = useContext(Context);

    const [buyDialog, setBuyDialog] = useState(false);
    const [buyProduct, setBuyProduct] = useState({});

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
            <Portal>
                <BuyDialog
                    visible={buyDialog}
                    close={() => {
                        setBuyDialog(false);
                        setBuyProduct({});
                    }}
                    product={buyProduct}
                    showSnackbar={showSnackbar}
                />
            </Portal>
            {
                !isFetchingAllProducts && !passedCheckProducts.length ? (
                    <Title
                        style={{
                            backgroundColor: 'white',
                            marginTop: 50,
                            alignSelf: 'center',
                        }}
                    >
                        沒有商品QQ
                    </Title>
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
                    <BuyCard
                        product={item}
                        onBuyPress={() => {
                            setBuyProduct(item);
                            setBuyDialog(true);
                        }}
                    />
                )}
            />
        </>
    )
};