<template>
	<view class="body">
		<view v-if="dataForm.img" class="backImg" :style="'background-image: url('+ dataForm.img +');'"></view>
		<!-- <u-image v-if="!dataForm.img" class="backImg" width="100%" height="400rpx" src="../../../static/img/logo.png">
		</u-image> -->
		<view v-if="!dataForm.img" class="backImg" width="100%"  style="background-image: url('https://hjzpzzh.com/logo.png');">
			
		</view>
		<view class="content">
			<view class="content-title">
				{{ dataForm.name }}
			</view>
			<view class="content-msgs">
				<view class="content-msgs-item">
					<view class="iconfont content-msgs-item-icon">
						&#xe8c5;
					</view>
					<view class="content-msgs-item-key">
						活动时间:
					</view>
					<view class="content-msgs-item-value">
						{{ dataForm.modifiedTime }}
					</view>
				</view>
				<u-line color="rgb(222, 222, 222)" style="width: 100%;"></u-line>
				<view class="content-msgs-item">
					<view class="iconfont content-msgs-item-icon">
						&#xe67e;
					</view>
					<view class="content-msgs-item-key">
						活动地点:
					</view>
					<view class="content-msgs-item-value">
						{{ dataForm.place }}
					</view>
				</view>
				<u-line color="rgb(222, 222, 222)" style="width: 100%;"></u-line>
				<view class="content-msgs-item">
					<view class="iconfont content-msgs-item-icon">
						&#xe8c3;
					</view>
					<view class="content-msgs-item-key">
						联系方式:
					</view>
					<view class="content-msgs-item-value">
						{{ dataForm.phone }}
					</view>
				</view>
			</view>
		</view>
		<view class="contenttext">
			<view class="contenttext-content">
				<view class="contenttext-content-name">
					活动详情
				</view>
				<view class="contenttext-content-value">
					<u-parse :content="dataForm.content"></u-parse>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<view class="content-reaction">
			<view class="share-btn">
				<u-button plain shape="circle" open-type="share" @click="shareAct(dataForm)">
					<view class="iconfont content-reaction-like">&#xe63f;</view>
				</u-button>
			</view>
			<view class="content-reaction-bot-btn">
				<u-button plain type="success" @click="joinActivity" v-if="apply == 0">我要参加
				</u-button>
				<u-button plain type="warning" @click="cancelActivity" v-if="apply == 1">取消报名
				</u-button>
				<u-button plain type="default" hover-class="none" v-if="apply == 2">已结束</u-button>
				<u-button plain type="primary" hover-class="none" v-if="apply == 3">已满员</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['activityId'],
		data() {
			return {
				dataForm: {},
				apply: ''
			};
		},
		mounted() {
			this.getAcrivityDetails();
		},
		methods: {
			getAcrivityDetails() {
				var getAPI = {
					id: this.activityId
				};
				this.$api.getAcrivityDetails(getAPI).then(res => {
					this.dataForm = res.data.data.acts;
					if (res.data.data.acts.num == 0) {
						this.apply = 3;
					} else {
						if (res.data.data.apply == 1) {
							this.apply = res.data.data.apply;
						} else {
							if (res.data.data.acts.status == 0) {
								this.apply = 0;
							} else {
								this.apply = 2;
							}
						}
					}
					// console.log(res.data.data.acts)
				});
			},
			joinActivity() {
				uni.showLoading();
				var postAPI = {
					id: this.activityId
				};
				this.$api.participateActivity(postAPI).then(res => {
					console.log(res);
					uni.hideLoading();
					if (res.data.code == 20000) {
						this.$refs.uToast.show({
							title: '已提交报名，等待管理员审核',
							type: 'success'
						});
					} else if (res.data.code == 2002) {
						this.$refs.uToast.show({
							title: '已报名，请勿重复提交',
							type: 'warning',
							url: '/pages/user/index'
						});
					}
					this.getAcrivityDetails();
				});
			},
			cancelActivity() {
				uni.showLoading();
				var postAPI = {
					id: this.activityId
				};
				this.$api.quitActivity(postAPI).then(res => {
					console.log(res);
					uni.hideLoading();
					if (res.data.code == 20000) {
						this.$refs.uToast.show({
							title: '已取消报名',
							type: 'success'
						});
					}
					this.getAcrivityDetails();
				});
			},
			shareAct(actInfo) {
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 1,
					title: actInfo.name
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.body {
		background-color: rgb(248, 248, 248);
		min-height: 100vh;

		.backImg {
			vertical-align: middle;
			height: 400rpx;
			width: 100%;
			overflow: hidden;
			background-repeat: no-repeat;
			background-position: center center;
			background-size: cover;
		}

		.content {
			margin: 0 auto;
			width: 93%;
			background-color: #ffffff;
			box-shadow: 0px 0px 2px rgb(111, 111, 111);
			position: relative;
			top: -150rpx;
			padding: 30rpx 0 10rpx 0;

			.content-title {
				margin: 0 auto;
				width: 94%;
				font-size: 35rpx;
				font-weight: 1000;
			}

			.content-msgs {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin: 20rpx 0;

				.content-msgs-item {
					display: flex;
					flex-direction: row;
					margin: 0 auto;
					width: 90%;
					height: 80rpx;
					align-items: center;

					.content-msgs-item-icon {
						font-size: 38rpx;
						color: rgb(182, 182, 182);
					}

					.content-msgs-item-key {
						font-size: 28rpx;
						color: rgb(191, 191, 191);
						margin: 0 15rpx 0 5rpx;
					}

					.content-msgs-item-value {
						font-size: 27rpx;
						color: rgb(79, 79, 79);
					}
				}
			}
		}

		.contenttext {
			margin: 0 auto;
			width: 93%;
			top: -120rpx;
			background-color: #ffffff;
			box-shadow: 0px 0px 2px rgb(111, 111, 111);
			position: relative;
			padding: 30rpx 0;

			.contenttext-content {
				width: 94%;
				margin: 0 auto;

				.contenttext-content-name {
					font-size: 28rpx;
					color: rgb(159, 159, 159);
					margin: 10rpx 0 60rpx 0;
				}

				.contenttext-content-value {
					font-size: 30rpx;
				}
			}

		}

		.content-reaction {
			position: fixed;
			z-index: 100;
			bottom: 0rpx;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			height: 130rpx;
			width: 100vw;
			background-color: #f9f9f9;
			border-top: 1rpx solid #e1e1e1;

			.content-reaction-bot-btn {
				margin: 0 30rpx;
			}

			.share-btn {
				width: 50px;

				.content-reaction-like {
					border-radius: 35rpx;
					background-color: rgb(255, 255, 255);
					display: flex;
					justify-content: center;
					align-items: center;
					font-weight: 1000;
					font-size: 35rpx;
					color: rgb(171, 171, 171);
				}
			}
		}
	}
</style>
