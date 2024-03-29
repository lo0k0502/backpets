import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    View,
} from 'react-native';
import {
    getMediaLibraryPermissionsAsync,
    getPendingResultAsync,
    launchImageLibraryAsync,
    MediaTypeOptions,
    requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import {
    Dialog,
    HelperText,
    Divider,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { addReport, deleteImage, editReport, uploadImage } from '../../../../api';
import { useCurrentLocation } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import TagsView from '../../../common/TagsView';
import { constants, isEmptyObject, shrinkImageToTargetSize } from '../../../../utils';
import DialogActions from '../../../common/DialogActions';
import SelectPhoto from '../../../common/SelectPhoto';
import SelectLocation from '../../../common/SelectLocation';
import TextArea from '../../../common/TextArea';
import { SERVERURL } from '../../../../api/API';

export default ({
    visible,
    close,
    report,
    setReport = () => {},
    refreshAllReports,
}) => {
    const user = useSelector(selectUser);
    const { currentLatitude, currentLongitude } = useCurrentLocation();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons. 
    const [changingLocation, setChangingLocation] = useState(false);

    const [content, setContent] = useState('');
    const [tags, setTags] = useState(constants.reportTagsArray.map(tagName => ({ name: tagName, selected: false })));
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        ...constants.locationDeltas,
    });
    const [photoUrl, setPhotoUrl] = useState('');
    const [photoSize, setPhotoSize] = useState({
        width: 300,
        height: 200,
    });

    const [contentErrorMsg, setContentErrorMsg] = useState('');
    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');

    const handleClose = () => {
        close();

        setReport({});

        setContent('');
        setTags(constants.reportTagsArray.map(tagName => ({ name: tagName, selected: false })));
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            ...constants.locationDeltas,
        });
        setPhotoUrl('');

        setContentErrorMsg('');
        setPhotoUrlErrorMsg('');
    };

    const checkContent = (text) => {
        setContent(text);
        setContentErrorMsg(text ? '' : '不可為空!!');
    };

    const handleExceedMaxTagLimit = () => {
        const firstSelectedTagIndex = tags.findIndex(tag => tag.selected);

        setTags(tags => tags.map((tag, index) => {
            if (index === firstSelectedTagIndex) return { ...tag, selected: false };
            return tag;
        }));

        return false;
    };

    // Change image
    const handleChangeImg = async () => {
        setIsImgLoading(true);

        // Check if user has granted us to access their media library. If no, ask once.
        if (!(await getMediaLibraryPermissionsAsync()).granted) {
            if (!(await requestMediaLibraryPermissionsAsync()).granted) {
                Alert.alert('權限不足!', '我們需要您的許可來存取您的媒體庫!', [{ text: '知道了' }]);
                setIsImgLoading(false);
                return;
            }
        }

        // Launch image picker
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        // Check if data gets lost, if so, use getPendingResultAsync function.
        if (!result) result = await getPendingResultAsync();
        if (!result) return setIsImgLoading(false);

        // If the final result is not cancelled, change the current photo url to the result photo's local url.
        if (!result.cancelled) setPhotoUrl(result.uri);

        setPhotoSize(shrinkImageToTargetSize(result.width, result.height, 300));

        setIsImgLoading(false);
    };

    const handleSubmit = async () => {
        // Start posting
        setIsLoading(true);
        
        try {
            let sendPhotoId = report.photoId;

            if (isEmptyObject(report) || (!isEmptyObject(report) && photoUrl !== `${SERVERURL}/image/${report.photoId}`)) {
                let formData = new FormData();
                const filename = photoUrl.split('/').pop();
                const mediatype = filename.split('.').pop();
    
                if (!(mediatype === 'jpg' || mediatype === 'jpeg' || mediatype === 'png')) {
                    setIsLoading(false);
                    return;
                }
    
                formData.append('image', {
                    uri: photoUrl,
                    name: filename,
                    type: 'image/jpeg',
                });

                const { data } = await uploadImage(formData);
                sendPhotoId = data.photoId;

                if (!isEmptyObject(report) && photoUrl !== `${SERVERURL}/image/${report.photoId}`) {
                    // If the previous image is in our database, delete it.
                    await deleteImage(report.photoId);
                }
            }

            if (isEmptyObject(report)) {
                // Add the report
                await addReport({
                    userId: user.info._id.toString(),
                    content,
                    tag: tags.find(tag => tag.selected).name,
                    photoId: sendPhotoId,
                    location: {
                        latitude: mapViewRegion.latitude, 
                        longitude: mapViewRegion.longitude, 
                    },
                });
            } else {
                // Edit the report
                await editReport(
                    report._id,
                    {
                        content,
                        tag: tags.find(tag => tag.selected).name,
                        photoId: sendPhotoId,
                        location: {
                            latitude: mapViewRegion.latitude, 
                            longitude: mapViewRegion.longitude, 
                        },
                    },
                );
            }

            setIsLoading(false);

            refreshAllReports();
            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.message) {
                console.log(`While ${isEmptyObject(report) ? 'adding' : 'editing'} report:`, error.response.data.message)
                setPhotoUrlErrorMsg(error.response.data.message);
            } else {
                console.log(`While ${isEmptyObject(report) ? 'adding' : 'editing'} report:`, error)
            }
        }
    };

    useEffect(() => {
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            ...constants.locationDeltas,
        });
    }, [currentLatitude, currentLongitude]);

    useEffect(() => {
        if (isEmptyObject(report)) return;

        setContent(report.content);
        setTags(constants.reportTagsArray.map(tagName => ({ name: tagName, selected: tagName === report.tag })));
        setMapViewRegion({
            ...report.location,
            ...constants.locationDeltas,
        });
        setPhotoUrl(`${SERVERURL}/image/${report.photoId}`);
    }, [report]);

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>{isEmptyObject(report) ? '發布' : '編輯'}通報</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    <HelperText></HelperText>
                    <TextArea
                        label='說明(必要)'
                        errorMsg={contentErrorMsg}
                        disabled={isImgLoading || isLoading}
                        value={content}
                        maxLength={50}
                        onChangeText={checkContent}
                    />
                    <Divider />
                    <HelperText>
                        請選擇一個標籤(必要)
                    </HelperText>
                    <TagsView maxLimit={1} onExceedMaxLimit={handleExceedMaxTagLimit} tagsState={[tags, setTags]} />
                    <Divider />
                    <HelperText>
                        位置(必要)
                    </HelperText>
                    <SelectLocation
                        region={mapViewRegion}
                        onChange={setMapViewRegion}
                        isLoading={isImgLoading || isLoading}
                        changingLocation={changingLocation}
                        setChangingLocation={setChangingLocation}
                    />
                    <Divider />
                    <SelectPhoto
                        label={photoUrl ? '更改圖片' : '新增圖片(必要)'}
                        photoUrl={photoUrl}
                        photoSize={photoSize}
                        errorMsg={photoUrlErrorMsg}
                        disabled={isImgLoading || isLoading}
                        isLoading={isImgLoading}
                        onChange={handleChangeImg}
                    />
                    <View style={{ height: 50 }} />
                </ScrollView>
            </Dialog.ScrollArea>
            <DialogActions
                cancelBtnLabel='取消'
                submitBtnLabel={isEmptyObject(report) ? '發布' : '編輯'}
                cancelBtnDisabled={isImgLoading || isLoading}
                submitBtnDisabled={
                    isImgLoading
                    || isLoading
                    || !content
                    || !tags.find(tag => tag.selected)
                    || changingLocation
                }
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
            />
        </Dialog>
    );
};