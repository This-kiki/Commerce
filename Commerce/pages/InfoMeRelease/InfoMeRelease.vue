<template>
	<view class="homeInfoContainer">
		<view class="selectLine">
			<view class="btn" @click="selectStatus(0)"
				:style="{'color':status == 0?'#fff':'#36c1ba','background-color':status == 0?'#36c1ba':''}">
				未审核
			</view>
			<view class="btn" @click="selectStatus(1)"
				:style="{'color':status == 1?'#fff':'#36c1ba','background-color':status == 1?'#36c1ba':''}">
				已通过
			</view>
			<view class="btn" @click="selectStatus(2)"
				:style="{'color':status == 2?'#fff':'#36c1ba','background-color':status == 2?'#36c1ba':''}">
				被驳回
			</view>
		</view>
		<scroll-view class="infoList" :style="{'height':height-40+'px'}" scroll-y="true" refresher-enabled="true"
			:refresher-triggered="loading" @refresherrefresh="refresh" @scrolltolower="loadMore">
			<slot slot="content" class="infoList">
				<view class="infoBox" v-for="item in infoList" :key="item.id" @click="infoDetail(item.id)">
					<news-card :item="item" :ref="item.id"></news-card>
					<view class="operate">
						<view class="delete" @tap.stop="deleteInfo(item.id)">
							<view class="iconfont icon-shanchu">
							</view>
							删除
						</view>
						<view class="edit" @tap.stop="editInfo(item.id)">
							<view class="iconfont icon-xiugai">
							</view>
							修改
						</view>
					</view>
				</view>
				<view v-if="loadmore" class="loadMore" @tap="loadMore">{{ loadmoreText }}</view>
				<view v-show="springback" class="loadMore">已经到底啦~~</view>
			</slot>
		</scroll-view>
		<u-popup :show="dialog" round="15" mode="bottom" @close="dialog=false">
			<button open-type="share" class="share" @click="shareInfo">
				<view class="iconfont share-icon">
					&#xe63f;
				</view>
				<view class="share-content">
					分享
				</view>
			</button>
		</u-popup>
	</view>
</template>

<script>
	import newsCard from '@/pages/RealTimeInfo/infoCard/index.vue';
	export default {
		props: ['height'],
		components: {
			newsCard
		},
		data() {
			return {
				// 当前选择状态
				status: 1,
				infoList: [],
				current: 1,
				loading: false,
				loadmore: true,
				loadmoreText: "加载更多",
				springback: false,

				dialog: false,
				shareId: ''
			};
		},
		created() {
			this.getAllHomeInfo()
		},
		methods: {
			shareInfo() {
				var getAPI = {
					id: this.shareId
				}
				this.$api.getOneInfo(getAPI).then((res) => {
					uni.share({
						provider: "weixin",
						scene: "WXSceneSession",
						type: 1,
						title: res.data.info.title,
						summary: res.data.info.simpleContent,
					});
				})
				this.dialog = false
			},
			dialogFather(id) {
				this.shareId = id
				this.dialog = true
			},
			refresh() {
				this.loading = true
				this.current = 1
				this.infoList = []
				this.springback = false
				this.loadmore = true
				this.loadmoreText = "加载更多"
				this.getAllHomeInfo()
			},
			loadMore() {
				this.current++
				this.loadmoreText = "正在加载中"
				this.getAllHomeInfo()
			},
			selectStatus(status) {
				this.loading = true
				this.status = status
				this.current = 1
				this.infoList = []
				this.springback = false
				this.loadmore = true
				this.loadmoreText = "加载更多"
				this.getAllHomeInfo()
			},
			// 获取所有资讯列表
			async getAllHomeInfo() {
				let res = await this.$api.getAllHomeInfo({
					status: this.status,
					current: this.current,
					openid: uni.getStorageSync("openid")
				})
				// console.log(res)
				let list = res.data.AllDynamic
				if (list.length == 0) {
					this.loadmore = false
					this.springback = true
					setTimeout(() => {
						this.springback = false
					}, 800)
				} else {
					list.forEach(item => {
						if (item.imag != '')
							// item.imag = JSON.parse(item.imag)
							if (item.imag.length > 1) {
								item.isImg = true
							}
					})
					this.infoList.push.apply(this.infoList, list);
				}
				setTimeout(() => {
					this.loading = false
				}, 300)
			},
			// 咨询详情
			infoDetail(id) {
				uni.navigateTo({
					url: '/pages/RealTimeInfo/DetailedInfo/DetailedInfo?infoId=' + id
				});
			},
			// 删除资讯
			async deleteInfo(id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除？',
					success: async function(res) {
						if (res.confirm) {
							let res = await that.$api.deleteInfo({
								id
							})
							if (res.code == 20000) {
								uni.showToast({
									title: "删除成功"
								})
								that.refresh()
							} else {
								uni.showToast({
									title: "删除失败",
									icon: "none"
								})
							}
						} else if (res.cancel) {
							return
						}
					}
				})
			},
			// 修改资讯
			editInfo(id) {
				uni.navigateTo({
					url: `/pages/InfoSubmit/InfoSubmit?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.homeInfoContainer {
		overflow-y: scroll;
		user-select: text;
		-webkit-user-select: text;

		.selectLine {
			height: 40px;

			.btn {
				font-size: 25rpx;
				border: 3rpx solid #36c1ba;
				border-radius: 10rpx;
				color: #36c1ba;
				padding: 6rpx 14rpx;
			}
		}

		.infoList {
			width: 96%;
			margin: 0rpx auto;
			background-color: #f5f5f5;

			.infoBox {
				background-color: #fff;
				margin: auto;
				padding-top: 10rpx;
				margin-bottom: 20rpx;

				.operate {
					margin-top: 14rpx;
					padding-top: 14rpx;
					border-top: 4rpx #eee solid;
					display: flex;
					justify-content: space-around;

					.delete,
					.edit {
						display: flex;
						align-items: center;
						color: #000;
						padding: 10rpx 0 20rpx;

						.iconfont {
							margin-right: 10rpx;
						}
					}
				}
			}
		}

		.loadMore {
			width: 100%;
			text-align: center;
			height: 80rpx;
			font-size: 25rpx;
			letter-spacing: 5rpx;
			color: rgb(175, 175, 175);
			margin-top: 30rpx;
		}

		.share {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 100%;
			width: 100%;
			border: 0 !important;
			outline: none;
			background-color: rgb(255, 255, 255);

			.share-icon {
				font-size: 40rpx;
				font-weight: 800;
				color: rgb(130, 130, 130);
				margin: 0 30rpx 0 40rpx;
			}

			.share-content {
				font-size: 30rpx;
				font-weight: 800;
				color: rgb(91, 91, 91);
			}
		}

		.share:active {
			background-color: rgb(227, 227, 227);
		}
	}
</style>
